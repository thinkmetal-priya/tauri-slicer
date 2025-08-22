use clipper2::{Clipper, FillRule, Path, Paths, Point};


pub fn get_infill_zigzag(
    min: [f64; 2],
    max: [f64; 2],
    outline: Path,
    holes: Vec<Path>,
    angle_deg: f64,
    spacing: f64,
) ->  Paths {
    let scale = 1000.0;

   
    let mut lines: Paths =  Paths::default();

    let mut y = min[1];
    while y <= max[1] {
        let line: Path = vec![
            Point::from([(min[0] * scale).round() as f64, (y * scale).round() as f64]),
            Point::from([(max[0] * scale).round() as f64, (y * scale).round() as f64]),
        ].into();
        lines.push(line);
        y += spacing;
    }

    // --- Build outline ---

    //  outline: Vec<[f64; 2]>,
    let outline_path: Path = outline.into_iter()
     .map(|p| Point::from([
    (p.x() * scale).round() as f64,
    (p.y() * scale).round() as f64
]))
        .collect::<Vec<_>>()
        .into();
    // let outline_paths: Paths = vec![outline_path];
    // --- Build holes ---
    let hole_paths: Paths = holes.into_iter().map(|hole| {
        hole.into_iter()
           .map(|p| Point::from([
    (p.x() * scale).round() as f64,
    (p.y() * scale).round() as f64
]))
            .collect::<Vec<_>>()
            .into()
    }).collect();

    // --- Perform intersection using builder API ---
    // let  clip = outline.to_clipper_subject();

    // for h in hole_paths {
    //     clip = clip.add_clip(h);
    // }
   
    let solution: Paths = outline_path
        .to_clipper_subject()
        .add_subject(lines)
        .intersect(FillRule::NonZero)
        .expect("Clipping failed");
    

 

    // --- Convert back to f64 ---
    solution.into_iter().map(|path| {
        path.into_iter().map(|p| {
            [p.x as f64 / scale, p.y as f64 / scale]
        }).collect()
    }).collect()
}
