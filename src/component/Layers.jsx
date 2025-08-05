import React, { useContext } from "react";
import { Context } from "../context";
import LineComp from "./LineComp";

const Layers = () => {
  const state = useContext(Context);

  const wholeLayerData = state.wholeLayerData;
  const topLayers = state.topLayers || 0;
  const baseLayers = state.baseLayers || 0;
  const currentLayer = state.currentLayerIndex;

  const filteredWhole = wholeLayerData
    .map((layer, index) => ({ layer, index }))
    .filter(({ layer }) => Array.isArray(layer) && layer.flat().length > 0);
  const target = filteredWhole.find((item) => item.index === currentLayer);
  if (!target) return null;
  console.log("target layers ", target);
  let color = "blue";

  if (target.index < baseLayers) {
    color = "green";
  } else if (target.index >= filteredWhole.length - topLayers) {
    color = "red";
  }

  return (
    <>
      <LineComp polygons={target.layer} color={color} />
    </>
  );
};

export default Layers;
