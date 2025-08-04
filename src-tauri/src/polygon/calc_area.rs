pub type Point = [f32; 3];
pub type Edges = (Point, Point);
pub type Polygon = Vec<Edges>;
pub type Polygons = Vec<Polygon>;
use serde::Serialize;
// pub type TreeNode = HashMap<usize, Vec<usize>>;
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Point2D(i64, i64);
pub struct TreeNode {
    pub id: usize,
    pub children: Vec<TreeNode>,
}
const SCALE: f64 = 1_000_000.0;
impl From<Point> for Point2D {
    fn from(p: Point) -> Self {
        Point2D((p[0] * 1_000_000.0) as i64, (p[1] * 1_000_000.0) as i64)
    }
}

use std::collections::{HashMap, HashSet};

fn build_containment_map(
    polygons: &[Polygon],
    sorted: &[(usize, f32)],
) -> HashMap<usize, Vec<usize>> {
    let mut map = HashMap::new();

    for &(parent_idx, _) in sorted.iter() {
        let parent_loop = segments_to_loop(&polygons[parent_idx]);

        for &(child_idx, _) in sorted.iter() {
            if parent_idx == child_idx {
                continue;
            }

            let child_shape = &polygons[child_idx];
            let mut inside_count = 0;

            for seg in child_shape {
                let pt = seg.0;
                if point_inside_polygon(pt, &parent_loop) {
                    inside_count += 1;
                }
            }

            if inside_count == child_shape.len() {
                map.entry(parent_idx).or_insert(Vec::new()).push(child_idx);
            }
        }
    }

    map
}

#[derive(Debug, Serialize)]
pub struct Label {
    id: usize,
    label: &'static str, // "solid" or "hole"
}

fn walk_and_label(tree: &[TreeNode], depth: usize, result: &mut Vec<Label>) {
    for node in tree {
        result.push(Label {
            id: node.id,
            label: if depth % 2 == 0 { "solid" } else { "hole" },
        });
        walk_and_label(&node.children, depth + 1, result);
    }
}

fn get_final_solid_hole_tree(map: &HashMap<usize, Vec<usize>>) -> Vec<TreeNode> {
    let mut visited = HashSet::new();
    let mut result = Vec::new();

    for key in map.keys() {
        if !visited.contains(key) {
            if let Some(tree) = build_tree(map, *key, &mut visited) {
                result.push(tree);
            }
        }
    }

    result
}

fn build_tree(
    map: &HashMap<usize, Vec<usize>>,
    node: usize,
    visited: &mut HashSet<usize>,
) -> Option<TreeNode> {
    if visited.contains(&node) {
        return None;
    }

    visited.insert(node);
    let mut children = Vec::new();

    if let Some(child_ids) = map.get(&node) {
        for &child in child_ids {
            if let Some(subtree) = build_tree(map, child, visited) {
                children.push(subtree);
            }
        }
    }

    // let mut node_map: TreeNode = TreeNode::new();
    // let node_map = TreeNode {
    //     id: node,
    //     children: child_trees,
    // };
    // node_map.insert(node, children);
    // Some(node_map)

    Some(TreeNode { id: node, children })
}

fn segments_to_loop(polygon: &Polygon) -> Vec<[f32; 2]> {
    let mut points = Vec::new();
    for &(start, _) in polygon {
        points.push([start[0], start[2]]); // Ignore Y, keep XZ
    }
    points
}

fn print_tree(nodes: &[TreeNode], depth: usize) {
    for node in nodes {
        println!("{:indent$}- Node ID: {}", "", node.id, indent = depth * 2);
        print_tree(&node.children, depth + 1);
    }
}

fn point_inside_polygon(point: [f32; 3], polygon: &[[f32; 2]]) -> bool {
    let (x, z) = (point[0], point[2]);
    let mut inside = false;
    let len = polygon.len();

    for i in 0..len {
        let j = (i + len - 1) % len;
        let xi = polygon[i][0];
        let zi = polygon[i][1];
        let xj = polygon[j][0];
        let zj = polygon[j][1];

        let intersect =
            ((zi > z) != (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi + 1e-10) + xi);
        if intersect {
            inside = !inside;
        }
    }

    inside
}

fn calculate_perimeter(points: &[Point2D]) -> f64 {
    let mut perimeter = 0.0;
    let n = points.len();
    for i in 0..n {
        let Point2D(x1, y1) = points[i];
        let Point2D(x2, y2) = points[(i + 1) % n];
        let dx = (x2 - x1) as f64 / SCALE;
        let dy = (y2 - y1) as f64 / SCALE;
        perimeter += (dx * dx + dy * dy).sqrt();
    }
    perimeter
}
#[tauri::command]
pub fn calculate_polygon_perimeter(polygons: Polygons) -> Vec<Label> {
    // println!("polygons Array {:?}", polygons);
    let mut polygon_perimeters: Vec<(usize, f32)> = polygons
        .iter()
        .enumerate()
        .map(|(idx, poly)| {
            let perimeter = poly
                .iter()
                .map(|(p1, p2)| {
                    let dx = p2[0] - p1[0];
                    let dz = p2[2] - p1[2];
                    (dx * dx + dz * dz).sqrt()
                })
                .sum();
            (idx, perimeter)
        })
        .collect();
    polygon_perimeters.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

    let child_map = build_containment_map(&polygons, &polygon_perimeters);

    let tree = get_final_solid_hole_tree(&child_map);

    let mut result = Vec::new();
    walk_and_label(&tree, 0, &mut result);

    // for label in result {
    //     println!("ID: {},Label:{}", label.id, label.label);
    // }
    result
}
