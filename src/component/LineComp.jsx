import React, { useContext } from "react";
import { Context } from "../context";
import LineCo from "./LineCo";
import AlignedZigZagInfill from "./AlignedZigZagInfill";

function LineComp({ layer, polygons, color }) {
  // ← accept color prop
  const state = useContext(Context);
  const len = polygons?.length || 0;

  const filtered = polygons.filter(
    (arr) => Array.isArray(arr) && arr.flat().length > 0
  );

  console.log("points value", polygons);

  return (
    <>
      {len > 0 &&
        filtered.map((polygon, index) => {
          const points = [];

          for (let edge of polygon) {
            const [start, end] = edge;
            // console.log("edge value ", edge);
            if (start.length === 3 && end.length === 3) {
              points.push(start, end);
            }
          }

          return (
            <React.Fragment key={index}>
              <LineCo points={points} color={color} />{" "}
              {/* ← pass color to LineCo */}
              {/* Optional infill */}
              {/* <AlignedZigZagInfill
                polygonSegments={polygon}
                spacing={1}
                angle={45}
              /> */}
            </React.Fragment>
          );
        })}
    </>
  );
}

export default LineComp;
