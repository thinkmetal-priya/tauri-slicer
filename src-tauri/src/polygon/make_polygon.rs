use std::collections::HashMap;

use std::collections::HashSet;
fn vectors_equal(a: [f32; 3], b: [f32; 3]) -> bool {
    (a[0] - b[0]).abs() < f32::EPSILON
        && (a[1] - b[1]).abs() < f32::EPSILON
        && (a[2] - b[2]).abs() < f32::EPSILON
}

// #[tauri::command]
// pub fn get_all_polygons(flat_points: Vec<f32>) -> Vec<Vec<([f32; 3], [f32; 3])>> {
//     let mut layer_polygons: HashMap<f32, Vec<Vec<([f32; 3], [f32; 3])>>> = HashMap::new();
//     // Convert flat array to Vec<([f32; 3], [f32; 3])>
//     let mut array_of_points = Vec::new();
//     let mut i = 0;
//     while i + 5 < flat_points.len() {
//         let p1 = [flat_points[i], flat_points[i + 1], flat_points[i + 2]];
//         let p2 = [flat_points[i + 3], flat_points[i + 4], flat_points[i + 5]];
//         array_of_points.push((p1, p2));
//         i += 6;
//     }
//     // println!("array_of_points: {:?}", array_of_points);
//     let mut used: HashSet<usize> = HashSet::new();
//     let mut polygons: Vec<Vec<([f32; 3], [f32; 3])>> = Vec::new();

//     fn build_polygon(
//         start_index: usize,
//         array: &Vec<([f32; 3], [f32; 3])>,
//         used: &mut HashSet<usize>,
//     ) -> Vec<([f32; 3], [f32; 3])> {
//         let mut polygon = vec![array[start_index]];
//         used.insert(start_index);

//         while polygon.len() < array.len() {
//             let last_segment = polygon.last().unwrap();
//             let second_vertex_of_last = last_segment.1;
//             let mut found = false;

//             for (j, segment) in array.iter().enumerate() {
//                 if used.contains(&j) {
//                     continue;
//                 }

//                 let (first_vertex, second_vertex) = *segment;

//                 if vectors_equal(second_vertex_of_last, first_vertex) {
//                     polygon.push((first_vertex, second_vertex));
//                     used.insert(j);
//                     found = true;
//                     break;
//                 } else if vectors_equal(second_vertex_of_last, second_vertex) {
//                     polygon.push((second_vertex, first_vertex));
//                     used.insert(j);
//                     found = true;
//                     break;
//                 }
//             }

//             if !found {
//                 break;
//             }
//         }

//         polygon
//     }

//     while used.len() < array_of_points.len() {
//         let mut next_start_index = None;
//         for i in 0..array_of_points.len() {
//             if !used.contains(&i) {
//                 next_start_index = Some(i);
//                 break;
//             }
//         }

//         if let Some(start_index) = next_start_index {
//             let polygon = build_polygon(start_index, &array_of_points, &mut used);
//             polygons.push(polygon);
//         } else {
//             break;
//         }
//     }

//     // println!("Total polygons found: {:?}", polygons);
//     // layer_polygons.insert(ylayer_value, polygons.clone());
//     polygons
// }

#[tauri::command]
pub fn get_all_polygons_old(flat_points: Vec<f32>) -> Vec<Vec<([f32; 3], [f32; 3])>> {
    let mut layer_polygons: HashMap<f32, Vec<Vec<([f32; 3], [f32; 3])>>> = HashMap::new();
    // Convert flat array to Vec<([f32; 3], [f32; 3])>
    let mut array_of_points = Vec::new();
    let mut i = 0;
    while i + 5 < flat_points.len() {
        let p1 = [flat_points[i], flat_points[i + 1], flat_points[i + 2]];
        let p2 = [flat_points[i + 3], flat_points[i + 4], flat_points[i + 5]];
        array_of_points.push((p1, p2));
        i += 6;
    }
    // println!("array_of_points: {:?}", array_of_points);
    let mut used: HashSet<usize> = HashSet::new();
    let mut polygons: Vec<Vec<([f32; 3], [f32; 3])>> = Vec::new();

    fn build_polygon(
        start_index: usize,
        array: &Vec<([f32; 3], [f32; 3])>,
        used: &mut HashSet<usize>,
    ) -> Vec<([f32; 3], [f32; 3])> {
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

    while used.len() < array_of_points.len() {
        let mut next_start_index = None;
        for i in 0..array_of_points.len() {
            if !used.contains(&i) {
                next_start_index = Some(i);
                break;
            }
        }

        if let Some(start_index) = next_start_index {
            let polygon = build_polygon(start_index, &array_of_points, &mut used);
            polygons.push(polygon);
        } else {
            break;
        }
    }

    // println!("Total polygons found: {:?}", polygons);
    // layer_polygons.insert(ylayer_value, polygons.clone());
    polygons
}
// 87*2-> 174
