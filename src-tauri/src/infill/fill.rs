
use clipper2::{Point,Path,Paths};
use std::f64::consts::PI;

#[derive(Debug, Clone)]
pub struct Part {
    pub outline: Vec<[f64; 2]>,
    pub holes: Vec<Vec<[f64; 2]>>,
}

/// Rotate a set of points by angle (degrees)
fn rotate_points(points: &[[f64; 2]], angle_deg: f64) -> Vec<[f64; 2]> {
    let radians = angle_deg * PI / 180.0;
    let cos = radians.cos();
    let sin = radians.sin();
    points.iter().map(|[x, y]| {
        [x * cos - y * sin, x * sin + y * cos]
    }).collect()
}

/// Compute min/max bounds of points
fn compute_bounds(points: &[[f64; 2]]) -> ([f64; 2], [f64; 2]) {
    let mut min_x = f64::INFINITY;
    let mut min_y = f64::INFINITY;
    let mut max_x = f64::NEG_INFINITY;
    let mut max_y = f64::NEG_INFINITY;

    for [x, y] in points {
        if *x < min_x { min_x = *x; }
        if *y < min_y { min_y = *y; }
        if *x > max_x { max_x = *x; }
        if *y > max_y { max_y = *y; }
    }
    ([min_x, min_y], [max_x, max_y])
}

/// Convert polygon to Clipper path (scaled integers)
fn to_clipper_path(points: &[[f64; 2]], scale: f64) -> Path {
    points.iter()
        .map(|[x, y]| Point::new((x * scale).round() as f64, (y * scale).round() as f64))
        .collect()
}

/// Convert multiple polygons
fn to_clipper_paths(paths: &[Vec<[f64; 2]>], scale: f64) -> Vec<Path> {
    paths.iter().map(|p| to_clipper_path(p, scale)).collect()
}

/// Convert back from Clipper path
fn from_clipper_path(path: &Path, scale: f64) -> Vec<[f64; 2]> {
    path.iter()
        .map(|p| [p.x() as f64 / scale, p.y() as f64 / scale])
        .collect()
}

/// Convert back multiple paths
fn from_clipper_paths(paths: &Paths, scale: f64) -> Vec<[[f64; 2]; 2]> {
    paths
        .iter()
        .flat_map(|p| {
            let pts = from_clipper_path(p, scale);
            pts.windows(2)
               .map(|w| [w[0], w[1]]) // convert pair of points into segment
               .collect::<Vec<_>>()
        })
        .collect()
}

/// Fill generator function
pub fn fill<FGet, FSort>(
    degree: f64,
    rectlinear: bool,
    zigzag: bool,
    line_width: f64,
    line_distance: f64,
    min_point: [f64; 2],
    max_point: [f64; 2],
    layer_nr: usize,
    part: &Part,
    get_infill: FGet,
    sort_infill: FSort,
) -> Vec<Vec<[f64; 2]>>
where
    // get_infill(min, max, outline_path, holes_paths, angle, spacing) -> Paths64
    FGet: Fn([f64; 2], [f64; 2], Path, Vec<Path>, f64, f64) -> Paths,
    // sort_infill(paths, zigzag, part) -> Vec<Vec<[f64; 2]>>
    FSort: Fn(Vec<[[f64; 2]; 2]>,bool, f64, f64 ) ->  Vec<[[f64; 2];2]> ,
{   
    let mut rotation = degree;
    if rectlinear && layer_nr % 2 == 0 {
        rotation += 90.0;
    }

    // Rotate outline and holes
    let outline_rot = rotate_points(&part.outline, rotation);
    let holes_rot: Vec<Vec<[f64; 2]>> = part.holes.iter()
        .map(|h| rotate_points(h, rotation))
        .collect();

    // Rotate bounding box
    let bbox = [
        [min_point[0], min_point[1]],
        [max_point[0], min_point[1]],
        [max_point[0], max_point[1]],
        [min_point[0], max_point[1]],
    ];
    let bbox_rot = rotate_points(&bbox, rotation);

    // Get rotated min/max
    let (min, max) = compute_bounds(&bbox_rot);

    let scale = 1000.0;

    // Generate infill via user-provided get_infill
    let result_infill = get_infill(
        min,
        max,
        to_clipper_path(&outline_rot, scale),
        to_clipper_paths(&holes_rot, scale),
        0.0,
        line_width,
    );

    // Convert back to f64
    let paths_f64 = from_clipper_paths(&result_infill, scale);

    // Sort infill paths
    let sorted = sort_infill(paths_f64, zigzag, 0.8,0.8);    
    // sorted is paths 

    // Rotate back
    sorted.iter()
        .map(|p| rotate_points(p, -rotation))
        .collect()
}
