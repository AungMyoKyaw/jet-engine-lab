#!/usr/bin/env python3
"""Independent mesh-space audit for original SolidCraft nozzle assemblies.

Checks physical mesh vertices, projected throat section and petal actuation
across modeled operating areas. This is NOT an OEM or experimental validation.
"""

import json
import math
import pathlib
import struct

ROOT = pathlib.Path(__file__).resolve().parent.parent
CAD = ROOT / 'public/assets/solidcraft'
OUT = ROOT / 'validation/nozzle-geometry-audit.json'
CD = 0.97
CORE_BORE = 0.500
CORE_TIP = 0.555
BYPASS_BORE = 1.100
BYPASS_TIP = 1.100
FAIRING = 0.650


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def mesh_positions(name):
    data = (CAD / (name + '.glb')).read_bytes()
    magic, version, length = struct.unpack_from('<III', data)
    check(magic == 0x46546C67 and version == 2 and length == len(data), name + ': invalid GLB header')
    cursor, manifest, blob = 12, None, None
    while cursor < length:
        size, kind = struct.unpack_from('<II', data, cursor)
        cursor += 8
        payload = data[cursor:cursor + size]
        check(len(payload) == size, name + ': truncated chunk')
        cursor += size
        if kind == 0x4E4F534A:
            manifest = json.loads(payload)
        elif kind == 0x004E4942:
            blob = payload
    check(manifest is not None and blob is not None, name + ': missing JSON or binary data')
    for node in manifest.get('nodes', []):
        check(not any(k in node for k in ('matrix', 'scale', 'rotation', 'translation')),
              name + ': nonidentity node transform makes raw positions nonrepresentative')
    points = []
    for mesh in manifest['meshes']:
        for primitive in mesh['primitives']:
            accessor = manifest['accessors'][primitive['attributes']['POSITION']]
            view = manifest['bufferViews'][accessor['bufferView']]
            check(accessor['type'] == 'VEC3' and accessor['componentType'] == 5126,
                  name + ': unsupported vertex format')
            stride = view.get('byteStride', 12)
            offset = view.get('byteOffset', 0) + accessor.get('byteOffset', 0)
            for index in range(accessor['count']):
                points.append(struct.unpack_from('<fff', blob, offset + index * stride))
    check(bool(points), name + ': no mesh vertices')
    return points


def radial(point):
    return math.hypot(point[1], point[2])


def near(actual, expected, tolerance, message):
    check(abs(actual - expected) < tolerance,
          f'{message}: measured {actual:.7f} m, expected {expected:.7f} m')


def edge(points, x_position):
    return [point for point in points if abs(point[0] - x_position) < .005]


def petal_deformed_radial(point, hinge, exit_x, target, nominal, radial_scale):
    x = point[0]
    r = radial(point)
    progress = max(0, min(1, (x - hinge) / (exit_x - hinge)))
    smooth = progress * progress * (3 - 2 * progress)
    # Independent implementation of runtime radial deformation, followed by mesh scale.
    return (r + (target / radial_scale - nominal) * smooth) * radial_scale


meshes = {name: mesh_positions(name) for name in (
    'core-throat-lip', 'nozzle-petals', 'bypass-throat-lip',
    'bypass-nozzle-petals', 'bypass-inner-fairing')}

core_lip_inner = min(map(radial, meshes['core-throat-lip']))
bypass_lip_inner = min(map(radial, meshes['bypass-throat-lip']))
fairing_outer = max(map(radial, meshes['bypass-inner-fairing']))
near(core_lip_inner, CORE_BORE, 1e-4, 'Core SolidCraft source aperture')
near(bypass_lip_inner, BYPASS_BORE, 1e-4, 'Bypass SolidCraft source aperture')
near(fairing_outer, FAIRING + .002, 1e-4, 'Bypass fairing outermost surface')

core_exit = max(p[0] for p in meshes['nozzle-petals'])
bypass_exit = max(p[0] for p in meshes['bypass-nozzle-petals'])
near(core_exit, .475, .0001, 'Core petal exit station')
near(bypass_exit, 3.680, .0001, 'Bypass petal exit station')
core_edge = edge(meshes['nozzle-petals'], core_exit)
bypass_edge = edge(meshes['bypass-nozzle-petals'], bypass_exit)
near(min(map(radial, core_edge)), CORE_TIP, .001, 'Core petal nominal exit')
near(min(map(radial, bypass_edge)), BYPASS_TIP, .001, 'Bypass petal nominal exit')

# Runtime model-specific nozzle scaling, including default TJ/TF part radii.
core_cases = []
for engine, part_radius in (('turbojet', .76), ('turbofan', .69)):
    radial_scale = part_radius / .962
    for effective_area in (.06, .20, .28, .40, .48, .90):
        geom_area = effective_area / CD
        target = math.sqrt(geom_area / math.pi)
        lip_bore = core_lip_inner * (target / CORE_BORE)
        tip = min(petal_deformed_radial(p, -.180, core_exit, target, CORE_TIP, radial_scale)
                  for p in core_edge)
        near(lip_bore, target, 1e-4, 'Core metering lip vs accepted radius')
        near(tip, lip_bore, .002, 'Core moving petal vs metering lip')
        near(CD * math.pi * lip_bore ** 2, effective_area, .0005,
             'Core measured aperture vs solver effective area')
        core_cases.append({'engine': engine, 'effectiveAreaM2': effective_area,
                           'geometricAreaM2': math.pi * lip_bore ** 2,
                           'boreRadiusM': lip_bore, 'petalInnerTipRadiusM': tip,
                           'tipAlignmentErrorMm': 1000 * (tip - lip_bore)})

bypass_cases = []
for effective_area in (.25, .30, .45, .60, .80):
    geom_area = effective_area / CD
    target = math.sqrt(geom_area / math.pi + FAIRING ** 2)
    lip_bore = bypass_lip_inner * target / BYPASS_BORE
    tip = min(petal_deformed_radial(p, 3.180, bypass_exit, target, BYPASS_TIP, 1)
              for p in bypass_edge)
    near(lip_bore, target, 1e-4, 'Bypass metering lip vs accepted radius')
    near(tip, lip_bore, .002, 'Bypass moving petal vs metering lip')
    check(tip > fairing_outer + .005, 'Bypass petal collides with inner fairing at exit')
    near(CD * math.pi * (lip_bore ** 2 - FAIRING ** 2), effective_area, .0005,
         'Bypass measured annular aperture vs solver effective area')
    bypass_cases.append({'effectiveAreaM2': effective_area,
                         'geometricAreaM2': math.pi * (lip_bore ** 2 - FAIRING ** 2),
                         'innerDesignRadiusM': FAIRING, 'outerBoreRadiusM': lip_bore,
                         'petalInnerTipRadiusM': tip,
                         'minimumPhysicalGapM': tip - fairing_outer,
                         'tipAlignmentErrorMm': 1000 * (tip - lip_bore)})

report = {
    'schema': 1,
    'validationLevel': 'original-CAD-mesh-internal-only',
    'scope': 'Independent binary-GLB vertex inspection and renderer-equivalent nozzle deformation; hypothetical design dimensions only.',
    'physicalValidation': False,
    'assumptions': {'units': 'm', 'dischargeCoefficient': CD,
                    'fairingDesignRadiusM': FAIRING, 'fairingOuterSurfaceRadiusM': fairing_outer,
                    'modelDimensionsAreMeasuredFromOEM': False,
                    'corePetalRadialScaleFromPartRadius': True},
    'sourceModels': {name: {'vertices': len(positions)} for name, positions in meshes.items()},
    'coreChecks': core_cases, 'bypassChecks': bypass_cases,
    'pass': True,
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(report, indent=2) + '\n')
print('SolidCraft CAD aperture audit: '
      f'{len(core_cases)} core and {len(bypass_cases)} bypass geometry cases PASS; '
      'not independently physically calibrated.')
