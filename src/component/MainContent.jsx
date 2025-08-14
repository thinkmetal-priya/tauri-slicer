import React, { useEffect } from "react";
import * as THREE from "three";
import CanvasComp from "./CanvasComp";
// import Slider from "./Slider";
import { useContext, useState } from "react";
import { Context, DispatchCtx } from "../context";
import { initialState } from "../context";
import {
  FILE,
  TOTALVERTICES,
  LAYER_HEIGHT,
  TOTAL_LAYERS,
  WHOLE_LAYERS_DATA,
  SEMI_TRANSPARENT,
  MAX_VAL_OF_RANGE,
  TOP_LAYERS,
  BASE_LAYERS,
  CLEAR_FILE,
  INFILL_DENSITY,
  CURRENT_LAYER_INDEX,
  CULLING_PLANE,
  ARRAY_OF_POLYGONS_ARRAY_PER_LAYER,
} from "../constants/actions";
import { useRef } from "react";

import { invoke } from "@tauri-apps/api/core";
import Loader from "./Loader";

import SingleLayerSlider from "./SingleLayerSlider";

const MainContent = () => {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);
  const meshRef = useRef();
  const [loader, setLoader] = useState(false);
  const inputRef = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (state.file) {
      handleClear();
    }

    const objUrl = window.URL.createObjectURL(file);
    dispatch({
      type: FILE,
      payload: objUrl,
    });
  };

  const total_layer = state.totalLayers;
  const handleSlice = async () => {
    setLoader((prev) => !prev);
    if (meshRef.current && meshRef.current.geometry) {
      const geometry = meshRef.current.geometry;
      if (!geometry?.attributes?.position) {
        console.error("Geometry is not available in meshRef");
        return;
      }
      const totalVertices = geometry.attributes.position.count;
      const vertices = geometry.attributes.position.array;
      // console.log("geom", geometry);
      const yMin = geometry.boundingBox.min.y;
      const yMax = geometry.boundingBox.max.y;
      const layerHeight = state.layerHeight;
      // console.log("layer height", layerHeight);
      dispatch({
        type: TOTALVERTICES,
        payload: totalVertices,
      });
      dispatch({
        type: "VERTICES",
        payload: vertices,
      });
      try {
        const invokeParams = [
          "vertices_to_points",
          {
            array: Array.from(vertices),

            yMin: yMin,
            yMax,
            yInc: layerHeight,
          },
        ];
        console.log("🚀 ~ handleSlice ~ invokeParams:", invokeParams);
        console.log("invokeParams", invokeParams);

        const verticesToPointsArray = await invoke(...invokeParams);
        // console.log("value of verticesToPoints array", verticesToPointsArray);

        const totalLayers = Object.keys(verticesToPointsArray).length;
        dispatch({
          type: TOTAL_LAYERS,
          payload: totalLayers,
        });

        const wholeLayerData = [];
        for (const key of Object.keys(verticesToPointsArray).sort(
          (a, b) => +a - +b
        )) {
          const ylayerValue = key;
          const pointsArray = verticesToPointsArray[key];
          const arrayOfAllPolygonArrays = {
            ylayerValue: ylayerValue,
            arrayOfPolygons: [],
          };
          // if (ylayerValue === "15") {
          //   console.log(
          //     "value of pointsArray of layer 30",
          //     verticesToPointsArray[ylayerValue]
          //   );
          // }

          // console.log("value of pointsArray", pointsArray);
          const polygonsArrMap = await invoke("get_line_seg", {
            layerYValue: ylayerValue,
            flatArray: pointsArray,
          });
          setLoader(false);
          // console.log("value for each layer, polygonArrMAp", polygonsArrMap);

          // in this log we're getting the y layer value

          Object.keys(polygonsArrMap).forEach((key) => {
            const arrayOfPolygons = polygonsArrMap[key];
            // const ylayerValue = key;
            // console.log("aarray val of polygons",arrayVal);
            dispatch({
              type: "POLYGONS_ARRAY_PER_LAYER",
              payload: { arrayOfPolygons, ylayerValue },
            });
            arrayOfAllPolygonArrays.arrayOfPolygons.push(arrayOfPolygons);
          });
          console.log("value of array fo all poly", arrayOfAllPolygonArrays); // this is for one layer
          try {
            const arrayOfPolygonArea = await invoke(
              "calculate_polygon_perimeter",
              {
                polygons: arrayOfAllPolygonArrays.arrayOfPolygons[0],
              }
            );
            // console.log("array of polygons area", arrayOfPolygonArea);
          } catch (error) {
            console.error("Error invoking calculate_polygon_perimeter:", err);
          }
          dispatch({
            type: "ARRAY_OF_POLYGONS_ARRAY_PER_LAYER",
            payload: arrayOfAllPolygonArrays,
          });
          // console.log()
          wholeLayerData.push(arrayOfAllPolygonArrays);
          // wholeLayerData.push(arrayOfPolygonArea)
        }
        dispatch({
          type: CULLING_PLANE,
          payload: new THREE.Plane(
            new THREE.Vector3(0, -1, 0),
            wholeLayerData.length * state.layerHeight || 100
          ),
        });

        dispatch({
          type: WHOLE_LAYERS_DATA,
          payload: wholeLayerData,
        });
      } catch (error) {
        console.error("Error during slicing:", error);
        return;
      }
    }
  };
  useEffect(() => {
    if (!state.file) {
      dispatch({
        type: FILE,
        payload: "/Users/priya/tauriSlicer/tauri-app/src/assets/cube(1).stl",
      });
    }
  }, []);
  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);

  const handleLayerChange = (e) => {
    const layerYValue = +e.target.value;
    // console.log("layer input  value ", layerYValue);
    dispatch({
      type: LAYER_HEIGHT,
      payload: layerYValue,
    });
  };
  const handleTopLayerChange = (e) => {
    const topLayerVal = +e.target.value;
    // console.log(" top layer input  value ", topLayerVal);
    dispatch({
      type: TOP_LAYERS,
      payload: topLayerVal,
    });
  };
  const handleInfillDensityChange = (e) => {
    const infillDensity = +e.target.value;
    // console.log("infill density value  ", infillDensity);
    dispatch({
      type: INFILL_DENSITY,
      payload: infillDensity,
    });
  };
  const handleBaseLayerChange = (e) => {
    const baseLayerVal = +e.target.value;
    console.log(" base layer input  value ", baseLayerVal);
    dispatch({
      type: BASE_LAYERS,
      payload: baseLayerVal,
    });
  };
  const handleCopyLayerData = () => {
    const currentLayer = state.currentLayerIndex;

    const wholeLayerData = state.wholeLayerData;
    // const filteredWhole = wholeLayerData
    //   .map((layer, index) => ({ layer, index }))
    //   .filter(({ layer }) => Array.isArray(layer) && layer.flat().length > 0);

    // console.log("filtered array", filteredWhole);
    const target = wholeLayerData.find((item, idx) => idx === currentLayer);
    navigator.clipboard
      .writeText(JSON.stringify(target?.arrayOfPolygons))
      .then(() => {
        alert("copied for layer: " + currentLayer);
      })
      .catch((err) => {
        alert("failed to copy");
        console.log("failed", { err });
      });
  };
  const handleReset = () => {
    dispatch({
      type: LAYER_HEIGHT,
      payload: initialState.layerHeight,
    });
    dispatch({
      type: TOP_LAYERS,
      payload: initialState.topLayers,
    });
    dispatch({
      type: BASE_LAYERS,
      payload: initialState.baseLayers,
    });

    dispatch({
      type: INFILL_DENSITY,
      payload: initialState.infillDensity,
    });
    // dispatch({
    //   type: SEMI_TRANSPARENT,
    //   payload: initialState.semiTransparent,
    // });
    // console.log("clicked on reste button");
  };
  const handleVisibility = () => {
    const currentVisibility = state.semiTransparent;
    console.log("Clicked on handle visibility", currentVisibility);

    dispatch({
      type: SEMI_TRANSPARENT,
      payload: !currentVisibility, // toggle the value
    });
  };
  const handleClear = () => {
    console.log("clear file button is clicked ");
    dispatch({ type: CLEAR_FILE });
    dispatch({
      type: CURRENT_LAYER_INDEX,
      payload: initialState.currentLayerIndex,
    });
    dispatch({
      type: TOTAL_LAYERS,
      payload: initialState.totalLayers,
    });
    dispatch({
      type: SEMI_TRANSPARENT,
      payload: initialState.semiTransparent,
    });
    dispatch({
      type: CULLING_PLANE,
      payload: initialState.cullingPlane,
    });
    dispatch({
      type: ARRAY_OF_POLYGONS_ARRAY_PER_LAYER,
      payload: initialState.arrayOfpolyonsArrayPerLayer,
    });

    // if (inputRef.current) {
    //   inputRef.current.value = "";
    // }
  };

  return (
    <section className="main-container">
      {/*  left control panel */}
      <section className="left-control-panel">
        <div className="inputs">
          {/* input for importing the file */}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor="">Import File</label>
            <input ref={inputRef} type="file" onChange={handleFileInput} />
          </div>
          {/* input for layer height */}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            {/*  Hide the negative number  */}
            <label htmlFor="">Layer Height</label>
            <input
              type="number"
              id="layerHeight"
              value={state.layerHeight}
              onChange={handleLayerChange}
              className="no-spinner"
            />
          </div>
          {/* input for selcting the number of top layer  */}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor=""> Top Layer</label>
            <input
              size="5"
              type="text"
              spellCheck="false"
              id="topLayers"
              value={state.topLayers}
              onChange={handleTopLayerChange}
            />
          </div>
          {/* Input for the numbert of base layer you want */}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor="">Bottom Layer</label>
            <input
              size="5"
              type="text"
              spellCheck="false"
              id="baseLayers"
              value={state.baseLayers}
              onChange={handleBaseLayerChange}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor="">Infill Density</label>
            <input
              size="5"
              type="text"
              spellCheck="false"
              id="baseLayers"
              value={state.infillDensity}
              onChange={handleInfillDensityChange}
            />
          </div>
          {/* <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor="cars">Fill pattern</label>
            <select name="fill-pattern" id="cars">
              <option value="linear">Linear</option>
              <option value="hex">Hex</option>
              <option value="grid">Grid</option>
              <option value="taingle">Traingle</option>
              <option value="gyroid">Gyroid</option>
            </select>
          </div> */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "8px", // optional spacing
            }}
          >
            <label htmlFor="cars">Infill pattern</label>
            <select
              name="fill-pattern"
              id="cars"
              style={{
                padding: "20px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                color: "#333",
                height: "23px",
              }}
            >
              <option value="linear">Linear</option>
              <option value="hex">Hex</option>
              <option value="grid">Grid</option>
              <option value="taingle">Traingle</option> {/* typo here */}
              <option value="gyroid">Gyroid</option>
            </select>
          </div>
        </div>
        <div className="btn-container">
          <button onClick={handleSlice}>Slice</button>
          <button onClick={handleReset}>Reset to Default</button>
          <button onClick={handleVisibility}>Visibilty</button>
          <button onClick={handleClear}>Clear Workspace</button>
        </div>
        {loader ? <Loader /> : ""}
      </section>
      {/* right section  */}

      <section className="right-panel">
        {total_layer ? <SingleLayerSlider /> : ""}
        {process.env.NODE_ENV === "dev" && (
          <button onClick={handleCopyLayerData}>CopyLayerData</button>
        )}
        <button onClick={handleCopyLayerData}>CopyLayerData</button>

        <CanvasComp meshRef={meshRef} />
      </section>
    </section>
  );
};

export default MainContent;
