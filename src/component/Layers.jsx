import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import LineComp from "./LineComp";

const Layers = () => {
  const state = useContext(Context);
  const [l, sl] = useState([]);
  const [c, sc] = useState("red");

  const wholeLayerData = state?.wholeLayerData;
  const topLayers = state.topLayers || 0;
  const baseLayers = state.baseLayers || 0;
  const currentLayer = state.currentLayerIndex;
  const totalLayers = state.totalLayers;

  useEffect(() => {
    if (!wholeLayerData) return;

    const target = wholeLayerData.find((item, idx) => idx === currentLayer);

    console.log("target layers ", target);

    if (target?.arrayOfPolygons) {
      if (currentLayer < baseLayers + 1) {
        sc("blue");
      } else if (currentLayer > totalLayers - topLayers) {
        sc("green");
      } else {
        sc("red");
      }

      sl(target.arrayOfPolygons);
    }
  }, [
    state?.wholeLayerData,
    state?.currentLayer,
    state?.localPlane?.constant,
    state.currentLayerIndex,
  ]);

  return <>{l.length > 0 && <LineComp polygons={l} color={c} />}</>;
};

export default Layers;
