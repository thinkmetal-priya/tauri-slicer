use clipper2::{Clipper, FillRule, Path, Paths, Point};


pub fn get_infill_zigzag(
    min: [f64; 2],
    max: [f64; 2],
    outline: Vec<[f64; 2]>,
    holes: Vec<Vec<[f64; 2]>>,
    angle_deg: f64,
    spacing: f64,
) -> Vec<Vec<[f64; 2]>> {
    let scale = 1000.0;

   
    let mut lines: Paths =  Paths::default();

    let mut y = min[1];
    while y <= max[1] {
        let line: Path = vec![
            Point64::from([(min[0] * scale).round() as i64, (y * scale).round() as i64]),
            Point64::from([(max[0] * scale).round() as i64, (y * scale).round() as i64]),
        ].into();
        lines.push(line);
        y += spacing;
    }

    // --- Build outline ---

    //  outline: Vec<[f64; 2]>,
    let outline_path: Path = outline.into_iter()
        .map(|[x, y]| Point64::from([(x * scale).round() as i64, (y * scale).round() as i64]))
        .collect::<Vec<_>>()
        .into();
    // let outline_paths: Paths = vec![outline_path];
    // --- Build holes ---
    let hole_paths: Paths = holes.into_iter().map(|hole| {
        hole.into_iter()
            .map(|[x, y]| Point64::from([(x * scale).round() as i64, (y * scale).round() as i64]))
            .collect::<Vec<_>>()
            .into()
    }).collect();

    // --- Perform intersection using builder API ---
    // let  clip = outline.to_clipper_subject();

    // for h in hole_paths {
    //     clip = clip.add_clip(h);
    // }
   
    // let solution: Paths = outline_path
    //     .to_clipper_subject()
    //     .add_subject(lines)
    //     .intersect(FillRule::NonZero)
    //     .expect("Clipping failed")
       let linesNew: Paths = vec![
        vec![(0, 0), (500, 0), (500, 500), (0, 500)]
            .into_iter()
            .map(|(x, y)| Point64::from([x, y]))
            .collect::<Vec<_>>()
            .into(),
    ];

    let mut clipper = Clipper::new();
    clipper.add_subject(outline_path);
    clipper.add_clip(linesNew);

    let solution: Paths = clipper
        .execute(ClipType::Intersection, FillRule::NonZero)
        .expect("Clipping failed");

    // --- Convert back to f64 ---
    solution.into_iter().map(|path| {
        path.into_iter().map(|p| {
            [p.x as f64 / scale, p.y as f64 / scale]
        }).collect()
    }).collect()
}
