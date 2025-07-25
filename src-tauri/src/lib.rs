mod geometry;
mod polygon;

// #[tauri::command]
// fn multiply_by_ten(value: f64) -> f64 {
//     value * 10.0
// }
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            geometry::slicing::vertices_to_points,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
