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

  const layerHeight = state.layerHeight;

  useEffect(() => {
    if (!wholeLayerData) return null;

    const arrOfLayers = wholeLayerData
      .map((o) => o.arrayOfPolygons)
      .filter((i) => Array.isArray(i) && i.flat().length > 0);
    const target = wholeLayerData.find((item, idx) => idx === currentLayer);

    console.log("target layers ", { arrOfLayers, target });
    let color = "blue";

    if (target?.ylayerValue < baseLayers * layerHeight) {
      color = "green";
    } else if (
      target?.ylayerValue >=
      (arrOfLayers.length - topLayers) * layerHeight
    ) {
      color = "red";
    }
    sc(color);
    if (target?.arrayOfPolygons) {
      console.log("setting...", target.arrayOfPolygons);

      sl(target.arrayOfPolygons);
    }
  }, [
    state?.wholeLayerData,
    state?.currentLayer,
    state?.localPlane?.constant,
    state.currentLayerIndex,
  ]);

  // useEffect(() => {
  //   console.log("[[[[[[[[[[[[", l);
  // }, [l]);

  // const wholeLayerData = state?.wholeLayerData;
  // if (!wholeLayerData) return null;

  return <>{l.length > 0 && <LineComp polygons={l} color={c} />}</>;
};

export default Layers;
