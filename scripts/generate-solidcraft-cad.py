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


def annulus(add, name, outer, inner, length, x):
    """A true B-rep annulus: the cutter extends beyond both planar end faces."""
    add("solid.cylinder", radius=outer, height=length,
        base=[x, 0, 0], axis="X", body_name=name)
    cutter = f"{name} bore"
    add("solid.cylinder", radius=inner, height=length + 12,
        base=[x - 6, 0, 0], axis="X", body_name=cutter)
    add("solid.combine", target=name, tools=[cutter], operation="cut")


def lofted_row(add, prefix, stations, count):
    """Spanwise tapered, twisted, cambered blade built from SolidCraft sketches."""
    sections = []
    for label, span, xshift, chord, lean, thick in stations:
        name = f"{prefix} {label} section"
        # The asymmetric six-point section gives a curved leading edge and
        # visible twist. These are illustrative shapes, not tested airfoils.
        outline = [
            [xshift - .52 * chord, lean - .25 * thick],
            [xshift - .23 * chord, lean - thick],
            [xshift + .31 * chord, lean - .72 * thick],
            [xshift + .52 * chord, lean + .22 * thick],
            [xshift + .09 * chord, lean + thick],
            [xshift - .36 * chord, lean + .80 * thick],
        ]
        add("sketch.create", name=name,
            plane={"origin": [0, span, 0], "x_dir": [1, 0, 0], "y_dir": [0, 0, 1]})
        add("sketch.line", points=outline, closed=True)
        add("sketch.finish")
        sections.append({"sketch": name})
    name = f"{prefix} blade"
    add("solid.loft", sections=sections, operation="new", body_name=name)
    add("solid.pattern.circular", bodies=[name], axis="X", count=count)


def fan_blisk():
    commands, add = build("Jet Engine Lab | wide-chord swept fan and spinner")
    add("solid.cylinder", radius=275, height=340, base=[-170, 0, 0], axis="X", body_name="Fan hub")
    annulus(add, "Fan root band", 325, 272, 75, 95)
    annulus(add, "Aft fan labyrinth seal", 298, 280, 55, 190)
    add("solid.cone", radius=60, top_radius=263, height=465,
        base=[-635, 0, 0], axis="X", body_name="Fan spinner")
    lofted_row(add, "Swept fan", [
        ("root", 280, -100, 360, -14, 42),
        ("midspan", 685, -45, 322, 8, 34),
        ("tip", 1050, 128, 208, 24, 19),
    ], 24)
    add("solid.cylinder", radius=24, height=45, base=[152, 300, 0],
        axis="X", body_name="Fan lock bolt")
    add("solid.pattern.circular", bodies=["Fan lock bolt"], axis="X", count=18)
    return commands


def compressor_cassette():
    commands, add = build("Jet Engine Lab | multistage axial compressor cassette")
    add("solid.cylinder", radius=295, height=600, base=[-300, 0, 0],
        axis="X", body_name="Compressor spool drum")
    for x in (-225, 225):
        add("solid.cylinder", radius=390, height=55, base=[x, 0, 0],
            axis="X", body_name=f"Compressor rotor disk {x}")
    annulus(add, "Forward compressor labyrinth seal", 344, 302, 58, -320)
    annulus(add, "Aft compressor labyrinth seal", 344, 302, 58, 270)
    lofted_row(add, "Forward compressor", [
        ("root", 345, -194, 245, -12, 25),
        ("midspan", 570, -166, 186, 3, 18),
        ("tip", 805, -103, 133, 20, 11),
    ], 26)
    lofted_row(add, "Aft compressor", [
        ("root", 345, 142, 193, -14, 22),
        ("midspan", 560, 161, 152, 1, 16),
        ("tip", 775, 205, 105, 18, 10),
    ], 30)
    return commands


def turbine_wheel():
    commands, add = build("Jet Engine Lab | high-temperature turbine bucket wheel")
    add("solid.cylinder", radius=418, height=165, base=[-83, 0, 0],
        axis="X", body_name="Turbine rotor disk")
    add("solid.cylinder", radius=275, height=305, base=[-153, 0, 0],
        axis="X", body_name="Turbine hub shaft")
    lofted_row(add, "Turbine bucket", [
        ("platform", 403, -55, 284, -18, 38),
        ("midspan", 600, -2, 228, 20, 29),
        ("tip", 803, 75, 189, 42, 17),
    ], 22)
    add("solid.cylinder", radius=19, height=42, base=[-100, 372, 0],
        axis="X", body_name="Turbine retention pin")
    add("solid.pattern.circular", bodies=["Turbine retention pin"], axis="X", count=22)
    return commands


def turbine_shroud():
    commands, add = build("Jet Engine Lab | stationary thermal shroud around turbine")
    annulus(add, "Turbine outer shroud", 847, 816, 108, 20)
    annulus(add, "Turbine forward mount flange", 872, 810, 35, -30)
    return commands


def stator_vane_ring():
    commands, add = build("Jet Engine Lab | stationary compressor inlet guide vanes")
    annulus(add, "Stator outer case ring", 856, 809, 105, 28)
    annulus(add, "Stator inner support ring", 347, 297, 132, 15)
    lofted_row(add, "Fixed guide vane", [
        ("root", 323, -5, 128, -12, 18),
        ("midspan", 560, 39, 126, 9, 15),
        ("tip", 810, 72, 111, 26, 11),
    ], 28)
    add("solid.cylinder", radius=15, height=42, base=[121, 825, 0],
        axis="X", body_name="Stator pitch boss")
    add("solid.pattern.circular", bodies=["Stator pitch boss"], axis="X", count=28)
    return commands


def combustor_liner():
    commands, add = build("Jet Engine Lab | cutaway double-wall annular combustor liner")
    annulus(add, "Combustor outer liner", 790, 752, 1230, -615)
    add("solid.box", length=1290, width=1050, height=1050,
        corner=[-645, 0, 0], body_name="Combustor liner cutaway tool")
    add("solid.combine", target="Combustor outer liner",
        tools=["Combustor liner cutaway tool"], operation="cut")
    annulus(add, "Combustor inner liner", 378, 342, 1120, -555)
    for x, r0, r1 in ((-595, 800, 740), (560, 800, 740)):
        annulus(add, f"Combustor mounting flange {x}", r0, r1, 34, x)
    # Annular cooling-band bosses and dilution port collars highlight liner
    # placement without pretending to resolve real cooling mass flow.
    add("solid.cylinder", radius=34, height=65,
        base=[-200, 765, 0], axis="X", body_name="Combustor dilution port collar")
    add("solid.pattern.circular", bodies=["Combustor dilution port collar"], axis="X", count=20)
    add("solid.cylinder", radius=20, height=38,
        base=[240, 773, 0], axis="X", body_name="Combustor cooling port collar")
    add("solid.pattern.circular", bodies=["Combustor cooling port collar"], axis="X", count=32)
    return commands


def nozzle_actuators():
    commands, add = build("Jet Engine Lab | nozzle external actuator linkage and sync rings")
    annulus(add, "Nozzle actuator anchor ring", 962, 874, 92, -350)
    annulus(add, "Nozzle synchronization ring", 872, 826, 52, 338)
    add("solid.cylinder", radius=31, height=590,
        base=[-295, 892, 0], axis="X", body_name="Nozzle actuator rod")
    add("solid.pattern.circular", bodies=["Nozzle actuator rod"], axis="X", count=16)
    add("solid.cylinder", radius=53, height=110,
        base=[-316, 895, 0], axis="X", body_name="Nozzle actuator piston collar")
    add("solid.pattern.circular", bodies=["Nozzle actuator piston collar"], axis="X", count=16)
    add("solid.cylinder", radius=23, height=86,
        base=[270, 856, 0], axis="X", body_name="Nozzle actuator end pin")
    add("solid.pattern.circular", bodies=["Nozzle actuator end pin"], axis="X", count=16)
    return commands


def fan_outlet_guides():
    """A fixed fan-exit guide row outside the fan's rotating assembly."""
    commands, add = build("Jet Engine Lab | fan outlet guide vanes and structural supports")
    annulus(add, "Fan outlet casing", 1050, 1008, 102, 336)
    annulus(add, "Outlet guide hub", 384, 331, 115, 317)
    lofted_row(add, "Fan exit guide vane", [
        ("inner", 374, 248, 152, -9, 24),
        ("mid", 697, 301, 143, 16, 21),
        ("outer", 1015, 363, 109, 28, 14),
    ], 24)
    add("solid.cylinder", radius=19, height=52, base=[425, 1020, 0],
        axis="X", body_name="Fan exit vane mount bolt")
    add("solid.pattern.circular", bodies=["Fan exit vane mount bolt"], axis="X", count=24)
    return commands


def compressor_case_detail():
    """Open service casing: hoops, ties and bleed bosses reveal the rotors."""
    commands, add = build("Jet Engine Lab | split compressor case hoops and bleed hardware")
    for x in (-350, -88, 275):
        annulus(add, f"Compressor casing rib {x}", 894, 838, 34, x)
        add("solid.cylinder", radius=18, height=35,
            base=[x + 35, 870, 0], axis="X",
            body_name=f"Compressor casing stud {x}")
        add("solid.pattern.circular", bodies=[f"Compressor casing stud {x}"], axis="X", count=24)
    add("solid.cylinder", radius=16, height=670,
        base=[-349, 876, 0], axis="X", body_name="Compressor case tie rod")
    add("solid.pattern.circular", bodies=["Compressor case tie rod"], axis="X", count=10)
    annulus(add, "Compressor bleed manifold", 923, 859, 45, 128)
    add("solid.cylinder", radius=29, height=80, base=[133, 904, 0],
        axis="X", body_name="Compressor bleed port boss")
    add("solid.pattern.circular", bodies=["Compressor bleed port boss"], axis="X", count=12)
    return commands


def turbine_nozzle_guide():
    """Nozzle-guide vanes are stationary upstream of the spinning turbine."""
    commands, add = build("Jet Engine Lab | turbine inlet nozzle guide vanes and heat shield")
    annulus(add, "Turbine NGV outer seal", 846, 800, 90, -372)
    annulus(add, "Turbine NGV inner support", 421, 382, 92, -372)
    lofted_row(add, "Turbine nozzle guide vane", [
        ("inner", 393, -338, 159, -25, 31),
        ("middle", 602, -308, 163, 8, 25),
        ("outer", 802, -291, 147, 32, 17),
    ], 26)
    add("solid.cylinder", radius=15, height=48, base=[-377, 820, 0],
        axis="X", body_name="NGV segment lock")
    add("solid.pattern.circular", bodies=["NGV segment lock"], axis="X", count=26)
    return commands


def bearing_cartridge():
    """Representative aft shaft bearing and load-carrying support spider."""
    commands, add = build("Jet Engine Lab | shaft bearing cartridge and support spider")
    annulus(add, "Aft bearing outer race", 354, 303, 186, 180)
    annulus(add, "Aft bearing inner race", 283, 243, 186, 180)
    annulus(add, "Bearing seal retainer", 387, 284, 36, 356)
    annulus(add, "Bearing support case", 635, 595, 64, 272)
    add("solid.box", length=64, width=306, height=52,
        corner=[272, 309, -26], body_name="Bearing support spider arm")
    add("solid.pattern.circular", bodies=["Bearing support spider arm"], axis="X", count=10)
    add("solid.cylinder", radius=20, height=49,
        base=[352, 341, 0], axis="X", body_name="Bearing race retention bolt")
    add("solid.pattern.circular", bodies=["Bearing race retention bolt"], axis="X", count=16)
    return commands


def combustor_dome():
    """Annular dome face and twelve swirler cups around the fuel delivery ring."""
    commands, add = build("Jet Engine Lab | annular combustor dome and fuel air swirlers")
    annulus(add, "Combustor dome backing", 758, 391, 42, -575)
    annulus(add, "Combustor dome stiffener", 784, 743, 66, -601)
    add("solid.cylinder", radius=74, height=128, base=[-605, 574, 0],
        axis="X", body_name="Combustor swirler cup")
    add("solid.cylinder", radius=42, height=140, base=[-611, 574, 0],
        axis="X", body_name="Combustor swirler bore")
    add("solid.combine", target="Combustor swirler cup",
        tools=["Combustor swirler bore"], operation="cut")
    add("solid.pattern.circular", bodies=["Combustor swirler cup"], axis="X", count=12)
    add("solid.cone", radius=35, top_radius=17, height=91,
        base=[-645, 574, 0], axis="X", body_name="Combustor fuel swirler cone")
    add("solid.pattern.circular", bodies=["Combustor fuel swirler cone"], axis="X", count=12)
    add("solid.cylinder", radius=12, height=49, base=[-603, 730, 0],
        axis="X", body_name="Combustor dome fastener")
    add("solid.pattern.circular", bodies=["Combustor dome fastener"], axis="X", count=36)
    return commands


def nozzle_petals():
    """Individually separated tapered petals lofted between radial stations."""
    commands, add = build("Jet Engine Lab | twenty convergent nozzle petal panels")
    sections = []
    for label, x, radius, width, thickness in (
        ("root", -460, 848, 122, 29),
        ("hinge", -180, 770, 113, 23),
        ("throat", 190, 654, 95, 20),
        ("lip", 475, 555, 78, 15),
    ):
        name = f"Nozzle petal {label} cross section"
        add("sketch.create", name=name,
            plane={"origin": [x, 0, 0], "x_dir": [0, 1, 0], "y_dir": [0, 0, 1]})
        add("sketch.line", points=[
            [radius - thickness / 2, -width / 2],
            [radius + thickness / 2, -width / 2],
            [radius + thickness / 2, width / 2],
            [radius - thickness / 2, width / 2],
        ], closed=True)
        add("sketch.finish")
        sections.append({"sketch": name})
    add("solid.loft", sections=sections, operation="new",
        body_name="Convergent nozzle petal")
    add("solid.pattern.circular", bodies=["Convergent nozzle petal"],
        axis="X", count=20)
    add("solid.cylinder", radius=23, height=34, base=[-465, 840, 0],
        axis="X", body_name="Nozzle petal root hinge")
    add("solid.pattern.circular", bodies=["Nozzle petal root hinge"],
        axis="X", count=20)
    return commands

def main():
    models = {"rotor-stage": rotor(), "planetary-reducer": gearbox(), "combustor-manifold": combustor(), "intake-duct": inlet(), "bypass-lattice": bypass(), "nozzle-housing": nozzle(), "radial-impeller": impeller(), "radial-diffuser": diffuser(), "afterburner-assembly": afterburner(),
              "fan-blisk": fan_blisk(), "compressor-cassette": compressor_cassette(), "turbine-wheel": turbine_wheel(), "turbine-shroud": turbine_shroud(), "stator-vane-ring": stator_vane_ring(), "combustor-liner": combustor_liner(), "nozzle-actuators": nozzle_actuators(),
              "fan-outlet-guides": fan_outlet_guides(), "compressor-case-detail": compressor_case_detail(), "turbine-nozzle-guide": turbine_nozzle_guide(), "bearing-cartridge": bearing_cartridge(), "combustor-dome": combustor_dome(), "nozzle-petals": nozzle_petals()}
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
