import React from "react";
import { Line } from "@react-three/drei";
import { useContext } from "react";
import { Context } from "../context";
const LineCo = ({ points, color = "blue" }) => {
  const state = useContext(Context);

  const transformedPoints = points.map(([x, y, z]) => [x, y, z]);

  return (
    <group>
      {transformedPoints.length > 1 && (
        <Line points={transformedPoints} color={color} lineWidth={1} />
      )}
    </group>
  );
};

export default LineCo;
