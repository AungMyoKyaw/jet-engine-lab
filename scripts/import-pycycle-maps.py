#!/usr/bin/env python3
"""Reproduce data-only derivatives of public pyCycle map tables.

No Python imports from pyCycle or arbitrary code execution: AST literal extraction only.
Source: https://github.com/OpenMDAO/pyCycle (Apache-2.0, see LICENSE.txt).
"""
import ast,hashlib,json,pathlib,urllib.request
HERE=pathlib.Path(__file__).resolve().parents[1]
OUT=HERE/'src/app/data/maps'
OUT.mkdir(parents=True,exist_ok=True)
COMMIT='ee7e16126a7a54b5fe35292c53b7eb4e9572620b'
BASE='https://raw.githubusercontent.com/OpenMDAO/pyCycle/'+COMMIT+'/pycycle/maps/'
VERSION='OpenMDAO/pyCycle '+COMMIT+' (2026-11-01 research snapshot)'
def fetch(name):
 req=urllib.request.Request(BASE+name,headers={'User-Agent':'JetEngineLab-AssetImporter'})
 with urllib.request.urlopen(req,timeout=25) as response:return response.read()
for name in ('Fan','LPC','HPC','HPT','LPT'):
 fn=name+'_map.py'
 original=fetch(fn);source=original.decode('utf-8');tree=ast.parse(source,filename=fn)
 data={}
 for node in tree.body:
  if isinstance(node,ast.Assign):
   for target in node.targets:
    if isinstance(target,ast.Attribute) and isinstance(target.value,ast.Name) and target.value.id==name+'Map':
     value=node.value
     if isinstance(value,ast.Call) and isinstance(value.func,ast.Attribute) and value.func.attr=='array' and value.args:
      data[target.attr]=ast.literal_eval(value.args[0])
     elif isinstance(value,ast.Constant) and target.attr=='RlineStall':
      data[target.attr]=value.value
    if isinstance(target,ast.Subscript) and isinstance(target.value,ast.Attribute) and isinstance(target.value.value,ast.Name) and target.value.value.id==name+'Map' and target.value.attr=='defaults':
     data.setdefault('defaults',{})[ast.literal_eval(target.slice)]=ast.literal_eval(node.value)
 if not data:raise RuntimeError('No map data found: '+fn)
 axes=['alphaMap','NcMap','RlineMap'] if name in ('Fan','LPC','HPC') else ['NpMap','PRmap']
 obj={'id':name,'sourceUrl':BASE+fn,'sourceSHA256':hashlib.sha256(original).hexdigest(),'license':'Apache-2.0','provenance':VERSION,'reviewStatus':'raw reference map; model and absolute speed unvalidated','arrays':data}
 output=OUT/(name.lower()+'.json')
 output.write_text(json.dumps(obj,separators=(',',':'),allow_nan=False)+'\n')
 print(output.relative_to(HERE),len(output.read_bytes()),'bytes; axes:',','.join(k for k in axes if k in data))
