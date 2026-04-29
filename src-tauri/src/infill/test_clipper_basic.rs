use clipper2::{One, Clipper, FillRule, Path, Paths, Point};

pub fn test_clipper_basic() {
    let line: Path<One> = vec![
        Point::new(5.0, -5.0),
        Point::new(5.0, 15.0),
    ].into();
    
    let square: Paths<One> = vec![(0.0, 0.0), (10.0, 0.0), (10.0, 10.0), (0.0, 10.0)].into();
    
    let result = Clipper::new()
        .add_open_subject(line)
        .add_clip(square)
        .intersect(FillRule::NonZero);
    
    match result {
        Ok(paths) => println!("With One scaler: {} segments", paths.len()),
        Err(_) => println!("With One scaler: failed"),
    }
}