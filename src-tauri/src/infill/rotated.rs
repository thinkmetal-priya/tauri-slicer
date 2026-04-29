use crate::polygon::poly_seg_outline::polygon_segments_to_outline;
use clipper2::{Clipper, FillRule, One, Path, Paths, Point};
use std::f64::consts::PI;

fn rotate_points(points: &[[f64; 2]], angle_deg: f64) -> Vec<[f64; 2]> {
    let radians = angle_deg * PI / 180.0;
    let cos = radians.cos();
    let sin = radians.sin();
    points
        .iter()
        .map(|[x, y]| [x * cos - y * sin, x * sin + y * cos])
        .collect()
}
#[tauri::command]
pub fn rotated(edges_matrix: Vec<Vec<[[f64; 3]; 2]>>) -> Vec<[f64; 2]> {
    // println!("edges_matrix: {:?}", edges_matrix);
    let arg = edges_matrix
        .iter()
        .map(|polygon| {
            polygon
                .iter()
                .map(|&[p1, p2]| (p1, p2))
                .collect::<Vec<([f64; 3], [f64; 3])>>()
        })
        .collect::<Vec<Vec<([f64; 3], [f64; 3])>>>();
    let outline = polygon_segments_to_outline(arg);
    // rotate the outline by 45 degree
    let rotated_outline = rotate_points(&outline, 45.0);

    rotated_outline
}
