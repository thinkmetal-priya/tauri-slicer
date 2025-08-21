/// Reverse a line: [[x1, y1], [x2, y2]] -> [[x2, y2], [x1, y1]]
fn reverse_line(line: &[[f64; 2]; 2]) -> [[f64; 2]; 2] {
    [line[1], line[0]]
}

/// Check if two points are within maxDistance
fn is_close_enough(p1: [f64; 2], p2: [f64; 2], max_distance: f64) -> bool {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    dx * dx + dy * dy <= max_distance * max_distance
}

/// Sort infill paths in zigzag order and insert connectors
pub fn sort_infill_paths(
    lines: Vec<[[f64; 2]; 2]>,
    zigzag: bool,
    line_width: f64,
    line_distance: f64,
) -> Vec<[[f64; 2]; 2]> {
    if !zigzag {
        return lines;
    }

    let mut sorted: Vec<[[f64; 2]; 2]> = Vec::new();
    let mut connectors: Vec<[[f64; 2]; 2]> = Vec::new();
    let mut flip = false;
    let mut last_end: Option<[f64; 2]> = None;
    let max_dist = line_width + line_distance * 2.0;

    for line in lines {
        let mut current = line;
        if flip {
            current = reverse_line(&current);
        }

        if let Some(last) = last_end {
            if is_close_enough(last, current[0], max_dist) {
                connectors.push([last, current[0]]);
            }
        }

        sorted.push(current);
        last_end = Some(current[1]);
        flip = !flip;
    }

    // Return connectors first, then sorted lines (same as JS)
    connectors.into_iter().chain(sorted.into_iter()).collect()
}
