use clipper2::{Centi, Clipper, FillRule, Path, Paths, Point};
#[tauri::command]
pub fn debug_infill(min: [f64; 2], max: [f64; 2], spacing: f64) -> Vec<Vec<[f64; 2]>> {
    let mut lines: Paths<Centi> = Default::default();

    let mut y = min[0];
    // min_y
    // max_y
    while y <= max[1] {
        let p1 = Point::<Centi>::new(min[0], y);
        let p2 = Point::<Centi>::new(max[0], y);
        let line: Path<Centi> = Path::<Centi>::new(vec![p1, p2]);
        lines.push(line);
        y += spacing;
    }

    lines
        .iter()
        .map(|path| {
            path.iter()
                .map(|point| [point.x(), point.y()])
                .collect::<Vec<[f64; 2]>>()
        })
        .collect::<Vec<Vec<[f64; 2]>>>()
}
