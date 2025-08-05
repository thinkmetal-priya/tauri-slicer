import React from "react";
import { Line } from "@react-three/drei";
import { useContext } from "react";
import { Context } from "../context";
const LineCo = ({ points, color = "blue" }) => {
  const state = useContext(Context);
  const currentLayer = state.currentLayerIndex;
  const layerHeight = state.layerHeight;

  const transformedPoints = points.map(([x, y, z]) => [
    x,
    currentLayer * layerHeight + 0.05,
    z,
  ]);

  return (
    <group>
      {transformedPoints.length > 1 && (
        <Line points={transformedPoints} color={color} lineWidth={5} />
      )}
    </group>
  );
};

export default LineCo;
