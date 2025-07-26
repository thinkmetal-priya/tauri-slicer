import React from "react";
import * as THREE from "three";
import CanvasComp from "./CanvasComp";
// import Slider from "./Slider";
import { useContext, useState } from "react";
import { Context, DispatchCtx } from "../context";
import { FILE, TOTALVERTICES } from "../constants/actions";
import { useRef } from "react";
// import sliceMesh from "../utils/sliceMesh";
// import { useEffect } from "react";
// When using the Tauri API npm package:
import { invoke } from "@tauri-apps/api/core";
// When using the Tauri global script (if not using the npm package)
// Be sure to set `app.withGlobalTauri` in `tauri.conf.json` to true
// const invoke = window.__TAURI__.core.invoke;

// Invoke the command
// invoke("my_custom_command");

const MainContent = () => {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);
  const meshRef = useRef();
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const objUrl = window.URL.createObjectURL(file);
    dispatch({
      type: FILE,
      payload: objUrl,
    });
  };

  const handleSlice = async () => {
    // const geometry = state.geometry;
    // const totalVertices = geometry.attributes.position.count;

    // console.log("value of total vertices", totalVertices);
    if (meshRef.current && meshRef.current.geometry) {
      const geometry = meshRef.current.geometry;
      if (!geometry?.attributes?.position) {
        console.error("Geometry is not available in meshRef");
        return;
      }
      const totalVertices = geometry.attributes.position.count;
      const vertices = geometry.attributes.position.array;
      const yMin = geometry.boundingBox.min.y;
      const yMax = geometry.boundingBox.max.y;
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
            yInc: 0.5,
          },
        ];
        console.log("🚀 ~ handleSlice ~ invokeParams:", invokeParams);
        console.log("invokeParams", invokeParams);

        const verticesToPointsArray = await invoke(...invokeParams);
        console.log("value of verticesToPoints array", verticesToPointsArray); 
       
        // let polygonsArrMap=null;
        // it is for each layer 
    const arrayOfAllPolygonArrays = [];
        for (const key of Object.keys(verticesToPointsArray)) {
          const ylayerValue = key;
          const pointsArray = verticesToPointsArray[key];
          // console.log("value of pointsArray", pointsArray);
           const polygonsArrMap = await invoke("get_line_seg", {
            layerYValue:ylayerValue,
            flatArray: pointsArray,
           
          });
           console.log("value for each layer",polygonsArrMap);
          Object.keys(polygonsArrMap).forEach((key)=>{
            const arrayOfPolygons=polygonsArrMap[key];
          
            // console.log("aarray val of polygons",arrayVal);
             dispatch({
            type: "POLYGONS_ARRAY_PER_LAYER",
            payload:arrayOfPolygons
          
          });
          arrayOfAllPolygonArrays.push(arrayOfPolygons);
          })
          dispatch({
            type:'ARRAY_OF_POLYGONS_ARRAY_PER_LAYER',
            payload:arrayOfAllPolygonArrays
          })
      
   
        }

      
        // const pointsArray = [];
        // Object.keys(verticesToPointsArray).forEach((key) => {
        //   const points = verticesToPointsArray[key];
          
        //   for (let i = 0; i < points.length; i += 3) {
        //     const x = points[i];
        //     const y = points[i + 1];
        //     const z = points[i + 2];
        //     pointsArray.push(x, y, z);
        //   } 
        
        // })
        // dispatch({
        //     type: "POLYGON_VERTICES_DEBUG",
        //     payload: {
          
        //       pointsArray,
        //     },
        //   });
      } catch (error) {
        console.error("Error during slicing:", error);
        return;
      }
    }
  };

  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);

  async function handleCompute() {
    await invoke("my_sec_cus_command");

    const multiply = await invoke("multiply_by_ten", { value: input });

    console.log("multiply by ten", multiply);
    setOutput(multiply);
  }

  return (
    <>
      <section>
      
        <div>
          <label htmlFor="">choose File</label>
          <input type="file" onChange={handleFileInput} />
        </div>
        <div>
          <button onClick={handleSlice}>Slice</button>
        </div>
        <div>
          <CanvasComp meshRef={meshRef} />
        </div>
        
      </section>
      
    </>
  );
};

export default MainContent;

