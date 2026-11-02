#!/usr/bin/env python3
"""Reproducible SolidCraft B-rep details for Jet Engine Lab.

Geometry is a representative educational illustration in millimetres. It is not
a measured production-engine model. Run from the repository root.
"""
from __future__ import annotations
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "solidcraft"
OUTPUT = ROOT / "public" / "assets" / "solidcraft"
SOURCE.mkdir(parents=True, exist_ok=True)
OUTPUT.mkdir(parents=True, exist_ok=True)


def build(name: str):
    commands = []
    def add(command: str, **params):
        commands.append({"command": command, "params": params})
    add("file.new", name=name)
    return commands, add


def rotor():
    commands, add = build("Jet Engine Lab | compressor and turbine stage (representative)")
    add("solid.cylinder", radius=190, height=190, base=[-95, 0, 0], axis="X", body_name="Drive hub")
    add("solid.cylinder", radius=340, height=118, base=[-59, 0, 0], axis="X", body_name="Rotor disk")
    add("solid.cylinder", radius=375, height=22, base=[-65, 0, 0], axis="X", body_name="Forward seal rim")
    add("solid.cylinder", radius=375, height=22, base=[43, 0, 0], axis="X", body_name="Rear seal rim")
    # Three spanwise sections make an editable, cambered and tapered CAD blade.
    # These are illustrative airfoil sections, NOT validated compressor profiles.
    sections = [
        ("Blade root", 310, [[-115,-26],[-75,-49],[35,-35],[125,3],[30,40],[-85,48]]),
        ("Blade mid", 515, [[-93,-16],[-43,-33],[48,-23],[108,9],[30,30],[-68,34]]),
        ("Blade tip", 730, [[-63,-9],[-30,-19],[35,-11],[88,14],[24,17],[-53,17]]),
    ]
    for label, span, outline in sections:
        add("sketch.create", name=label,
            plane={"origin": [0, span, 0], "x_dir": [1, 0, 0], "y_dir": [0, 0, 1]})
        add("sketch.line", points=outline, closed=True)
        add("sketch.finish")
    add("solid.loft", sections=[{"sketch": entry[0]} for entry in sections],
        operation="new", body_name="Rotor blade")
    add("solid.pattern.circular", bodies=["Rotor blade"], axis="X", count=24)
    add("solid.cylinder", radius=31, height=35, base=[-92, 256, 0], axis="X", body_name="Front fastener")
    add("solid.pattern.circular", bodies=["Front fastener"], axis="X", count=12)
    add("solid.cone", radius=122, top_radius=55, height=155, base=[-247, 0, 0], axis="X", body_name="Shaft nose")
    return commands


def gearbox():
    commands, add = build("Jet Engine Lab | geared fan epicyclic reducer (representative)")
    add("solid.cylinder", radius=690, height=125, base=[-62.5, 0, 0], axis="X", body_name="Annular gearbox housing")
    add("solid.cylinder", radius=555, height=135, base=[-67.5, 0, 0], axis="X", body_name="Bore cutter")
    add("solid.combine", target="Annular gearbox housing", tools=["Bore cutter"], operation="cut")
    add("solid.cylinder", radius=176, height=156, base=[-78, 0, 0], axis="X", body_name="Sun wheel")
    add("solid.cylinder", radius=55, height=220, base=[-110, 0, 0], axis="X", body_name="Input drive shaft")
    add("solid.box", length=154, width=67, height=37, corner=[-77, 165, -18.5], body_name="Sun gear tooth")
    add("solid.pattern.circular", bodies=["Sun gear tooth"], axis="X", count=20)
    for index, (y, z) in enumerate(((363,0), (0,363), (-363,0), (0,-363)), start=1):
        add("solid.cylinder", radius=131, height=123, base=[-61.5,y,z], axis="X",
            body_name=f"Planet wheel {index}")
        add("solid.box", length=124, width=36, height=30,
            corner=[-62,y+122,z-15], body_name=f"Planet tooth {index}")
        add("solid.pattern.circular", bodies=[f"Planet tooth {index}"],
            axis={"origin": [0,y,z], "dir": [1,0,0]}, count=16)
        add("solid.cylinder", radius=43, height=214, base=[-107,y,z], axis="X",
            body_name=f"Planet bearing {index}")
    add("solid.box", length=45, width=345, height=55, corner=[110, 0, -27.5], body_name="Planet carrier arm")
    add("solid.pattern.circular", bodies=["Planet carrier arm"], axis="X", count=4)
    add("solid.cylinder", radius=112, height=42, base=[108, 0, 0], axis="X", body_name="Output carrier boss")
    return commands


def combustor():
    commands, add = build("Jet Engine Lab | annular combustor fuel manifold (representative)")
    add("solid.cylinder", radius=565, height=125, base=[-62.5, 0, 0], axis="X", body_name="Annular fuel manifold")
    add("solid.cylinder", radius=447, height=135, base=[-67.5, 0, 0], axis="X", body_name="Manifold bore tool")
    add("solid.combine", target="Annular fuel manifold", tools=["Manifold bore tool"], operation="cut")
    add("solid.cylinder", radius=26, height=480, base=[-246, 505, 0], axis="X", body_name="Fuel delivery tube")
    add("solid.pattern.circular", bodies=["Fuel delivery tube"], axis="X", count=12)
    add("solid.cylinder", radius=60, height=72, base=[-115, 505, 0], axis="X", body_name="Injector collar")
    add("solid.pattern.circular", bodies=["Injector collar"], axis="X", count=12)
    add("solid.cone", radius=67, top_radius=11, height=110, base=[212, 505, 0], axis="X", body_name="Atomizer tip")
    add("solid.pattern.circular", bodies=["Atomizer tip"], axis="X", count=12)
    return commands



def inlet():
    commands, add = build("Jet Engine Lab | 270-degree cutaway intake duct")
    add("solid.cone", radius=1030, top_radius=855, height=1500, base=[-750,0,0],
        axis="X", body_name="Intake duct outer")
    add("solid.cone", radius=940, top_radius=775, height=1520, base=[-760,0,0],
        axis="X", body_name="Intake flow bore")
    add("solid.combine", target="Intake duct outer", tools=["Intake flow bore"], operation="cut")
    add("solid.box", length=1800, width=1300, height=1300,
        corner=[-900,0,0], body_name="Cutaway quadrant tool")
    add("solid.combine", target="Intake duct outer", tools=["Cutaway quadrant tool"], operation="cut")
    for x, r in ((-710,1010),(690,830)):
        add("solid.cylinder", radius=r, height=65, base=[x,0,0],
            axis="X", body_name=f"Intake flange at {x}")
        add("solid.cylinder", radius=r-85, height=75, base=[x-5,0,0],
            axis="X", body_name=f"Flange bore at {x}")
        add("solid.combine", target=f"Intake flange at {x}",
            tools=[f"Flange bore at {x}"], operation="cut")
    return commands


def bypass():
    commands, add = build("Jet Engine Lab | open lattice bypass flow duct")
    for x in (-3950,-2600,600,3550):
        add("solid.cylinder", radius=1000, height=95,
            base=[x,0,0], axis="X", body_name=f"Bypass structural hoop {x}")
        add("solid.cylinder", radius=938, height=105,
            base=[x-5,0,0], axis="X", body_name=f"Bypass hoop bore {x}")
        add("solid.combine", target=f"Bypass structural hoop {x}",
            tools=[f"Bypass hoop bore {x}"], operation="cut")
    add("solid.cylinder", radius=17, height=7600, base=[-3920,980,0],
        axis="X", body_name="Bypass axial longeron")
    add("solid.pattern.circular", bodies=["Bypass axial longeron"], axis="X", count=12)
    return commands


def nozzle():
    commands, add = build("Jet Engine Lab | cutaway nozzle support housing")
    add("solid.cone", radius=930, top_radius=625, height=1020,
        base=[-510,0,0], axis="X", body_name="Nozzle variable throat casing")
    add("solid.cone", radius=830, top_radius=510, height=1040,
        base=[-520,0,0], axis="X", body_name="Nozzle bore")
    add("solid.combine", target="Nozzle variable throat casing", tools=["Nozzle bore"],operation="cut")
    add("solid.box", length=1300,width=1200,height=1200,
        corner=[-650,0,0],body_name="Nozzle inspection section")
    add("solid.combine",target="Nozzle variable throat casing",
        tools=["Nozzle inspection section"],operation="cut")
    return commands


def impeller():
    commands, add = build("Jet Engine Lab | centrifugal impeller illustration")
    add("solid.cone",radius=480,top_radius=1010,height=490,
        base=[-245,0,0],axis="X",body_name="Radial impeller disk")
    add("solid.cone",radius=350,top_radius=130,height=270,
        base=[-390,0,0],axis="X",body_name="Inducer hub")
    add("solid.box",length=390,width=390,height=65,
        corner=[-205,590,-32.5],body_name="Swept radial vane")
    add("solid.move",bodies=["Swept radial vane"],axis=[0,1,0],angle=18)
    add("solid.pattern.circular",bodies=["Swept radial vane"],axis="X",count=18)
    add("solid.cylinder",radius=190,height=660,
        base=[-420,0,0],axis="X",body_name="Impeller central shaft")
    return commands


def diffuser():
    commands, add = build("Jet Engine Lab | centrifugal diffuser illustration")
    add("solid.cylinder",radius=1040,height=145,
        base=[-72.5,0,0],axis="X",body_name="Diffuser outer shroud")
    add("solid.cylinder",radius=825,height=155,
        base=[-77.5,0,0],axis="X",body_name="Diffuser passage")
    add("solid.combine",target="Diffuser outer shroud",tools=["Diffuser passage"],operation="cut")
    add("solid.box",length=195,width=490,height=45,
        corner=[-97,420,-22.5],body_name="Radial flow guide vane")
    add("solid.pattern.circular",bodies=["Radial flow guide vane"],axis="X",count=20)
    return commands


def afterburner():
    commands, add = build("Jet Engine Lab | afterburner flameholder and fuel bars")
    for x in (-440,300):
        add("solid.cylinder",radius=910,height=90,
            base=[x,0,0],axis="X",body_name=f"Flameholder hoop {x}")
        add("solid.cylinder",radius=825,height=100,
            base=[x-5,0,0],axis="X",body_name=f"Flameholder bore {x}")
        add("solid.combine",target=f"Flameholder hoop {x}",
            tools=[f"Flameholder bore {x}"],operation="cut")
    add("solid.cylinder",radius=26,height=730,
        base=[-360,780,0],axis="X",body_name="Spray bar")
    add("solid.pattern.circular",bodies=["Spray bar"],axis="X",count=12)
    add("solid.cone",radius=68,top_radius=12,height=125,
        base=[300,780,0],axis="X",body_name="Spray nozzle")
    add("solid.pattern.circular",bodies=["Spray nozzle"],axis="X",count=12)
    return commands

def main():
    models = {"rotor-stage": rotor(), "planetary-reducer": gearbox(), "combustor-manifold": combustor(), "intake-duct": inlet(), "bypass-lattice": bypass(), "nozzle-housing": nozzle(), "radial-impeller": impeller(), "radial-diffuser": diffuser(), "afterburner-assembly": afterburner()}
    for name, commands in models.items():
        source = SOURCE / f"{name}.json"
        source.write_text(json.dumps({"commands": commands}, indent=2) + "\n")
        cmd = ["solidcraft-cli", "run", str(source), "--save", str(SOURCE / f"{name}.sc"),
               "--out", str(SOURCE / f"{name}.obj"), "--param-check", "strict", "--quiet"]
        print(f"Generating {name} with SolidCraft…", flush=True)
        subprocess.run(cmd, cwd=ROOT, check=True)
        obj = SOURCE / f"{name}.obj"
        if not obj.is_file() or obj.stat().st_size < 1000:
            raise RuntimeError(f"Missing/empty CAD mesh: {obj}")
    print("SolidCraft source CAD and OBJ meshes generated.", flush=True)


if __name__ == "__main__":
    main()
