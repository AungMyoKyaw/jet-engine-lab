"""Convert original SolidCraft OBJ exports into small material-batched glTF meshes.

CAD geometry is authored in SolidCraft (.sc) in millimetres and Z-up.
This converter only assigns materials, changes units/axes and combines meshes
sharing a material for economical Three.js draw calls; no CAD geometry is authored here.
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "solidcraft"
TARGET = ROOT / "public" / "assets" / "solidcraft"
TARGET.mkdir(parents=True, exist_ok=True)

PALETTES = {
    "blade": ((.57,.70,.81,1),.86,.32),
    "shell": ((.18,.29,.38,1),.77,.39),
    "bronze": ((.78,.52,.27,1),.78,.35),
    "steel": ((.40,.51,.60,1),.84,.35),
}

def role(name):
    name=name.lower()
    if any(w in name for w in ("vane","blade","tooth","impeller disk")):
        return "blade"
    if any(w in name for w in ("manifold","housing","casing","duct outer","shroud","structural hoop","flameholder hoop")):
        return "shell"
    if any(w in name for w in ("collar","injector","atomizer","carrier","spray nozzle","flange","seal rim")):
        return "bronze"
    return "steel"

def get_material(key):
    m = bpy.data.materials.get("Jet Lab CAD - " + key)
    if m:
        return m
    color,metal,rough=PALETTES[key]
    m=bpy.data.materials.new(name="Jet Lab CAD - " + key)
    m.diffuse_color=color
    m.use_nodes=True
    bsdf=m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value=color
    bsdf.inputs["Metallic"].default_value=metal
    bsdf.inputs["Roughness"].default_value=rough
    return m

models=(
    "rotor-stage","planetary-reducer","combustor-manifold",
    "intake-duct","bypass-lattice","nozzle-housing",
    "radial-impeller","radial-diffuser","afterburner-assembly",
)
for name in models:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.ops.wm.obj_import(filepath=str(SOURCE / (name+".obj")), forward_axis="Y", up_axis="Z")
    meshes=[o for o in bpy.context.scene.objects if o.type=="MESH"]
    if not meshes:
        raise RuntimeError("No SolidCraft geometry: "+name)
    for obj in meshes:
        material=get_material(role(obj.name))
        obj.data.materials.clear()
        obj.data.materials.append(material)
        obj.scale=(.001,.001,.001)
        bpy.ops.object.select_all(action="DESELECT")
        obj.select_set(True)
        bpy.context.view_layer.objects.active=obj
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for key in PALETTES:
        selected=[o for o in bpy.context.scene.objects
                  if o.type=="MESH" and o.active_material and o.active_material.name=="Jet Lab CAD - "+key]
        if not selected:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        for obj in selected:
            obj.select_set(True)
        bpy.context.view_layer.objects.active=selected[0]
        if len(selected)>1:
            bpy.ops.object.join()
        selected[0].name=name+" - "+key
    bpy.ops.object.select_all(action="SELECT")
    path=TARGET/(name+".glb")
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",export_yup=True,
        export_apply=False,export_materials="EXPORT",export_cameras=False,export_lights=False)
    count=len([o for o in bpy.context.scene.objects if o.type=="MESH"])
    print(f"GLB {name}: {len(meshes)} original B-rep bodies -> {count} web meshes, {path.stat().st_size} bytes",flush=True)
