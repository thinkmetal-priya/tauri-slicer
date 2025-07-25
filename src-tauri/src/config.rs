config = {
    // size of gcode debug arrow head
    debug_arrow: 0.25,
    // default # of decimal places in generated gcode
    gcode_decimals: 4,
    // heal disjoint polygons in slicing (experimental)
    bridgeLineGapDistance: 0.05,
    bridgeLineGapDistanceMax: 25,
    // Bounds default margin nearTo
    // Polygon.offset mindist2 offset precision
    precision_offset: 0.05,
    // Polygon.isEquivalent area() isCloseTo
    precision_poly_area: 0.05,
    // Polygon.isEquivalent bounds() equals value
    precision_poly_bounds: 0.01,
    // Polygon.isEquivalent point distance to other poly line
    precision_poly_merge: 0.05,
    // Polygon.traceIntersects mindist2
    // Polygon.overlaps (bounds overlaps test precision)
    // Polygon.isEquivalent circularity (is circle if 1-this < merge)
    // Slope.isSame (vert/horiz w/in this value)
    // isCloseTo() default for dist
    // sliceIntersects point merge dist for non-fill
    precision_merge: 0.005,
    precision_slice_z: 0.0001,
    // Point.isInPolygon nearPolygon value
    // Point.isInPolygonNotNear nearPolygon value
    // Point.isMergable2D distToSq2D value
    // Point.isMergable3D distToSq2D value
    // Polygon.isInside nearPolygon value
    // Polygon.isOutside nearPolygon value
    precision_merge_sq: sqr(0.005),
    // Bound.isNested inflation value for potential parent
    precision_bounds: 0.0001,
    // Slope.isSame default precision
    precision_slope: 0.02,
    // Slope.isSame use to calculate precision
    precision_slope_merge: 0.25,
    // sliceIntersect point merge distance for fill
    precision_fill_merge: 0.001,
    // convertPoints point merge distance
    // other values break cube-s9 (wtf)
    precision_decimate: 0.05,
    // decimate test over this many points
    decimate_threshold: 500000,
    // Point.onLine precision distance (endpoints in Polygon.intersect)
    precision_point_on_line: 0.01,
    // Polygon.isEquivalent value for determining similar enough to test
    precision_circularity: 0.001,
    // polygon fill hinting (settings override)
    hint_len_min: sqr(3),
    hint_len_max: sqr(20),
    hint_min_circ: 0.15,
    // tolerances to determine if a point is near a masking polygon
    precision_mask_tolerance: 0.001,
    // Polygon isInside,isOutside tolerance (accounts for midpoint skew)
    precision_close_to_poly_sq: sqr(0.001),
    // how long a segment has to be to trigger a midpoint check (inner/outer)
    precision_midpoint_check_dist: 1,
    precision_nested_sq: sqr(0.01),
    // clipper multiplier
    clipper: 100000,
    // clipper poly clean
    clipperClean: 250
};