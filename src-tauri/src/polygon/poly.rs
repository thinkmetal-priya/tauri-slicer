use ordered_float::OrderedFloat;
use std::collections::HashSet;
use std::{collections::HashMap, f32::INFINITY}; // Add this import
pub type Point = [f32; 3];
pub type Edges = (Point, Point);
pub type Polygon = Vec<Edges>;
pub type Polygons = Vec<Polygon>;

fn vectors_equal(a: [f32; 3], b: [f32; 3]) -> bool {
    const TOLERANCE: f32 = 0.0001;
    (a[0] - b[0]).abs() < TOLERANCE
        && (a[1] - b[1]).abs() < TOLERANCE
        && (a[2] - b[2]).abs() < TOLERANCE
}
fn build_polygon(start_index: usize, array: &Polygon, used: &mut HashSet<usize>) -> Polygon {
    let mut polygon = vec![array[start_index]];
    used.insert(start_index);

    while polygon.len() < array.len() {
        let last_segment = polygon.last().unwrap();
        let second_vertex_of_last = last_segment.1;
        let mut found = false;

        for (j, segment) in array.iter().enumerate() {
            if used.contains(&j) {
                continue;
            }

            let (first_vertex, second_vertex) = *segment;

            if vectors_equal(second_vertex_of_last, first_vertex) {
                polygon.push((first_vertex, second_vertex));
                used.insert(j);
                found = true;
                break;
            } else if vectors_equal(second_vertex_of_last, second_vertex) {
                polygon.push((second_vertex, first_vertex));
                used.insert(j);
                found = true;
                break;
            }
        }

        if !found {
            break;
        }
    }

    polygon
}

pub fn get_all_polygons(array_of_edges: Vec<Edges>) -> Polygons {
    let mut used: HashSet<usize> = HashSet::new();
    let mut polygons: Vec<Vec<Edges>> = Vec::new();
    while used.len() < array_of_edges.len() {
        let mut next_start_index = None;
        for i in 0..array_of_edges.len() {
            if !used.contains(&i) {
                next_start_index = Some(i);
                break;
            }
        }

        if let Some(start_index) = next_start_index {
            let polygon = build_polygon(start_index, &array_of_edges, &mut used);
            polygons.push(polygon);
        } else {
            break;
        }
    }
    polygons
}
#[tauri::command]
pub fn get_line_seg(
    layer_y_value: OrderedFloat<f32>,
    flat_array: Vec<f32>,
) -> HashMap<OrderedFloat<f32>, Vec<Vec<Edges>>> {
    let mut i = 0;
    // array of edges

    let mut edges_array: Vec<Edges> = vec![];
    // let mut map_of_layer_with_edges: HashMap<OrderedFloat<f32>, Vec<Edges>> = HashMap::new();
    let mut map_of_layer_with_edges: HashMap<OrderedFloat<f32>, Vec<Vec<Edges>>> = HashMap::new();

    while i + 5 < flat_array.len() {
        let p1: Point = [flat_array[i], flat_array[i + 1], flat_array[i + 2]];
        let p2: Point = [flat_array[i + 3], flat_array[i + 4], flat_array[i + 5]];

        edges_array.push((p1, p2));
        i += 6;
    }

    // map_of_layer_with_edges.insert(layer_y_value, edges_array);
    let polygons = get_all_polygons(edges_array);
    map_of_layer_with_edges.insert(layer_y_value, polygons);
    // map_of_layer_with_edges
    map_of_layer_with_edges
}

// from line segment it shpuld make polygon
