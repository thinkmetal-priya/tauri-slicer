use crate::polygon::poly::get_line_seg;
// use crate::polygon::make_polygon::get_all_polygons;

use ordered_float::OrderedFloat;
use std::{collections::HashMap, f64::INFINITY};
pub type Point = [f64; 3];
pub type Edges = (Point, Point);
pub type Polygon = Vec<Edges>;
pub type Polygons = Vec<Polygon>;
#[tauri::command]
pub fn vertices_to_points(
    array: Vec<f64>,
    y_min: f64,
    y_max: f64,
    y_inc: f64,
) -> HashMap<String, Vec<Vec<Edges>>> {
    let mut inter_section_planes: Vec<f64> = vec![];

    let mut polygon_vertices: HashMap<OrderedFloat<f64>, Vec<f64>> = HashMap::new();

    let mut y_slicing_index = y_min;
    while y_slicing_index <= y_max {
        inter_section_planes.push(y_slicing_index);
        y_slicing_index += y_inc;
    }

    // println!("Intersection Y-planes: {:?}", inter_section_planes);

    let mut i = 0;
    while i + 8 < array.len() {
        let p1 = (array[i], array[i + 1], array[i + 2]); // (x1, y1, z1)
        let p2 = (array[i + 3], array[i + 4], array[i + 5]); // (x2, y2, z2)
        let p3 = (array[i + 6], array[i + 7], array[i + 8]); // (x3, y3, z3)

        let max_y = p1.1.max(p2.1).max(p3.1);
        let min_y = p1.1.min(p2.1).min(p3.1);

        for y in &inter_section_planes {
            if *y < min_y || *y > max_y {
                continue;
            }

            let mut intersections: [(f64, f64, f64); 2] = [
                (INFINITY, INFINITY, INFINITY),
                (INFINITY, INFINITY, INFINITY),
            ];

            for &(a, b) in &[(&p1, &p2), (&p2, &p3), (&p3, &p1)] {
                if (a.1 - y) * (b.1 - y) <= 0.0 && a.1 != b.1 && a.1 != *y && b.1 != *y {
                    // Linear interpolation factor t for y
                    let t = (y - a.1) / (b.1 - a.1);
                    let x = a.0 + t * (b.0 - a.0);
                    let z = a.2 + t * (b.2 - a.2);
                    // intersections.push((x, *y, z));
                    match intersections.get(0) {
                        Some((val_x, _, _)) => {
                            if val_x.clone() == INFINITY {
                                intersections[0] = (x, *y, z);
                            } else {
                                intersections[1] = (x, *y, z);
                            }
                        }
                        None => intersections[0] = (x, *y, z),
                    };
                }
            }

            if intersections.len() >= 2 {
                let y_key = OrderedFloat(*y);
                let entry = polygon_vertices.entry(y_key).or_insert_with(Vec::new);

                for point in intersections.iter() {
                    if (point.0 == INFINITY && point.1 == INFINITY && point.2 == INFINITY) {
                        continue; // Skip invalid points
                    }
                    entry.push(point.0); // x
                    entry.push(point.1); // y
                    entry.push(point.2); // z
                }

                // polygons_final.entry(y_key).or_insert_with(Vec::new).push(entry.clone());
            }
        }

        i += 9;
    }



let mut map_of_layer_with_polygon_seg: HashMap<String, Vec<Vec<Edges>>> = HashMap::new();

for (y_key, vertices) in &polygon_vertices {
    let key_str = y_key.to_string();
    let edges_map = get_line_seg(key_str, vertices.clone()); // HashMap<String, Vec<Vec<Edges>>>

    for (layer, edges_matrix) in &edges_map {
        // Insert into global map, merging if already exists
        map_of_layer_with_polygon_seg
            .entry(layer.clone()) // <-- use layer from edges_map, not key_str
            .or_insert_with(Vec::new)
            .extend(edges_matrix.clone());
    }
}


    // let mut all_layer_edges = HashMap::new();

    // for (y_key, entry) in &polygon_vertices {
    //     // entry is Vec<f64> (flat array of points)
    //     let edges_map = get_line_seg(*y_key, entry.clone());

    //     // all_layer_edges.extend(edges_map);
    // }
    // get_line_seg(y_key, entry);
    // get_polygons();
    // for (y, vertices) in &polygon_vertices {
    //     println!("Y: {}, Vertices count: {}", y, vertices.len() / 3,);
    // }

    // println!(
    //     "Total intersection planes with polygons: {}",
    //     polygon_vertices.len()
    // );
    // Convert HashMap<OrderedFloat<f64>, Vec<f64>> to a serializable map
    // reduce the number of points ny checking collinearity de-duplication
    // let serializable_map: HashMap<String, Vec<f64>> = polygon_vertices
    //     .into_iter()
    //     .map(|(k, v)| (k.to_string(), v))
    //     .collect();

    // serde_json::to_value(serializable_map).unwrap()
    // polygon_vertices


    map_of_layer_with_polygon_seg
}
// traverse the hashset and send the value (array of points) to the  function
// get all polygons

// for (_key, value) in &polygon_vertices {
//     let poly = get_all_polygons(value);
//     // You can process `poly` here as needed
// }

// use ordered_float::OrderedFloat;
// use std::collections::HashMap;
// #[tauri::command]
// pub fn vertices_to_points(array: Vec<f64>, y_min: f64, y_max: f64, y_inc: f64) {
//     let mut inter_section_planes: Vec<f64> = vec![];
//     let mut polygon_vertices: HashMap<OrderedFloat<f64>, Vec<f64>> = HashMap::new();

//     let mut y_slicing_index = y_min;
//     while y_slicing_index <= y_max {
//         inter_section_planes.push(y_slicing_index);
//         y_slicing_index += y_inc;
//     }

//     println!("Intersection Y-planes: {:?}", inter_section_planes);

//     let mut i = 0;
//     while i + 8 < array.len() {
//         let p1 = (array[i], array[i + 1], array[i + 2]); // (x1, y1, z1)
//         let p2 = (array[i + 3], array[i + 4], array[i + 5]); // (x2, y2, z2)
//         let p3 = (array[i + 6], array[i + 7], array[i + 8]); // (x3, y3, z3)

//         let max_y = p1.1.max(p2.1).max(p3.1);
//         let min_y = p1.1.min(p2.1).min(p3.1);

//         for y in &inter_section_planes {
//             if *y < min_y || *y > max_y {
//                 continue;
//             }

//             let mut intersections = vec![];

//             for &(a, b) in &[(&p1, &p2), (&p2, &p3), (&p3, &p1)] {
//                 if (a.1 - y) * (b.1 - y) <= 0.0 && a.1 != b.1 {
//                     // Linear interpolation factor t for y
//                     let t = (y - a.1) / (b.1 - a.1);
//                     let x = a.0 + t * (b.0 - a.0);
//                     let z = a.2 + t * (b.2 - a.2);
//                     intersections.push((x, *y, z));
//                 }
//             }

//             if intersections.len() >= 2 {
//                 let y_key = OrderedFloat(*y);
//                 let entry = polygon_vertices.entry(y_key).or_insert_with(Vec::new);
//                 for point in intersections.iter() {
//                     entry.push(point.0); // x
//                     entry.push(point.1); // y
//                     entry.push(point.2); // z
//                 }
//             }
//         }

//         i += 9;
//     }

//     for (y, vertices) in &polygon_vertices {
//         println!(
//             "Y: {}, Vertices count: {}, Points: {:?}",
//             y,
//             vertices.len() / 3,
//             vertices
//         );
//     }

//     println!(
//         "Total intersection planes with polygons: {}",
//         polygon_vertices.len()
//     );
// }
