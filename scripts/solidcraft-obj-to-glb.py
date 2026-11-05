"""Convert original SolidCraft OBJ exports into small material-batched glTF meshes.

CAD geometry is authored in SolidCraft (.sc) in millimetres and Z-up.
This converter only assigns materials, changes units/axes and combines meshes
sharing a material for economical Three.js draw calls; no CAD geometry is authored here.
"""
from pathlib import Path
import bpy
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "solidcraft"
TARGET = ROOT / "public" / "assets" / "solidcraft"
TARGET.mkdir(parents=True, exist_ok=True)

PALETTES = {
    "blade": ((.61,.70,.76,1),.91,.235),
    "shell": ((.21,.29,.34,1),.84,.34),
    "bronze": ((.78,.54,.33,1),.87,.255),
    "steel": ((.45,.54,.61,1),.90,.275),
    "heat": ((.68,.57,.48,1),.84,.30),
    "heat_shell": ((.37,.33,.32,1),.80,.39),
    "fastener": ((.74,.78,.80,1),.91,.21),
    "seal": ((.105,.13,.16,1),.70,.42),
    "fuel": ((.69,.43,.26,1),.82,.29),
}

def role(name):
    name=name.lower()
    if "throat metering lip" in name:
        return "bronze"
    if any(w in name for w in ("turbine nozzle guide", "turbine bucket", "turbine rotor", "nozzle petal", "flameholder", "atomizer tip")):
        return "heat"
    if any(w in name for w in ("turbine outer", "turbine forward", "combustor outer liner", "combustor inner liner", "combustor dome backing")):
        return "heat_shell"
    if any(w in name for w in ("fuel delivery", "fuel manifold", "fuel swirler", "spray bar")):
        return "fuel"
    if any(w in name for w in ("bolt","stud","fastener","retention pin","segment lock","end pin","pitch boss","rolling element")):
        return "fastener"
    if any(w in name for w in ("labyrinth", "bearing seal", "inner race", "outer race", "bearing cage")):
        return "seal"
    if any(w in name for w in ("vane","blade","bucket","tooth","impeller disk","guide")):
        return "blade"
    if any(w in name for w in ("manifold","housing","casing","duct outer","shroud","structural hoop","outer liner","case ring","casing rib", "support case", "nozzle synchronization")):
        return "shell"
    if any(w in name for w in ("collar","injector","carrier","spray nozzle","flange","seal rim","cooling port", "swirler cup", "dome stiffener","igniter", "lubrication", "oil feed")):
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
    "planetary-reducer","combustor-manifold",
    "intake-duct","bypass-lattice","nozzle-housing",
    "radial-impeller","radial-diffuser","afterburner-assembly",
    "fan-blisk","compressor-cassette","turbine-wheel","turbine-shroud",
    "stator-vane-ring","combustor-liner","nozzle-actuators",
    "fan-outlet-guides","compressor-case-detail","turbine-nozzle-guide",
    "bearing-cartridge","combustor-dome","nozzle-petals",
    "shaft-single-spool","shaft-dual-spool",
    "bearing-roller-train","compressor-service-hardware",
    "combustor-thermal-hardware","gearbox-support-hardware",
    "core-throat-lip","bypass-throat-lip", "bypass-inner-fairing","bypass-nozzle-petals",
)
requested = set(sys.argv[sys.argv.index('--')+1:]) if '--' in sys.argv else set()
if requested - set(models):
    raise ValueError(f"Unknown SolidCraft families: {sorted(requested-set(models))}")
for name in models:
    if requested and name not in requested:
        continue
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
