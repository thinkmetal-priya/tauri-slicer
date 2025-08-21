pub fn polygon_segments_to_outline(
    polygon_segments: Vec<Vec<([f64; 3], [f64; 3])>>,
) -> Vec<[f64; 2]> {
    // Flatten all segments into a single Vec of points
    let segments: Vec<[f64; 3]> = polygon_segments
        .into_iter()
        .flatten()
        .flat_map(|(start, end)| vec![start, end])
        .collect();

    // Convert [x, y, z] -> [x, z]
    let mut edges: Vec<([f64; 2], [f64; 2])> = segments
        .chunks(2)
        .map(|chunk| {
            let start = [chunk[0][0], chunk[0][2]];
            let end = [chunk[1][0], chunk[1][2]];
            (start, end)
        })
        .collect();

    if edges.is_empty() {
        return Vec::new();
    }

    // Start with first segment
    let mut outline = vec![edges[0].0];
    let mut current_point = edges[0].1;
    edges.remove(0);

    // Helper for float equality check
    let eq = |a: f64, b: f64| (a - b).abs() < 1e-6;

    while !edges.is_empty() {
        if let Some(match_index) = edges.iter().position(|(start, end)| {
            (eq(start[0], current_point[0]) && eq(start[1], current_point[1]))
                || (eq(end[0], current_point[0]) && eq(end[1], current_point[1]))
        }) {
            let (mut start, mut end) = edges[match_index];

            // If current point is the end, reverse
            if eq(end[0], current_point[0]) && eq(end[1], current_point[1]) {
                std::mem::swap(&mut start, &mut end);
            }

            outline.push(current_point);
            current_point = end;

            edges.remove(match_index);
        } else {
            eprintln!("No matching segment found — polygon may be open.");
            break;
        }
    }

    // Close polygon if needed
    if !outline.is_empty()
        && (!eq(outline[0][0], current_point[0]) || !eq(outline[0][1], current_point[1]))
    {
        outline.push(current_point);
    }

    outline
}
