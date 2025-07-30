import React, { useEffect } from "react";
import * as THREE from "three";
import CanvasComp from "./CanvasComp";
// import Slider from "./Slider";
import { useContext, useState } from "react";
import { Context, DispatchCtx } from "../context";
import { initialState } from "../context";
import { FILE, TOTALVERTICES ,LAYER_HEIGHT, TOTAL_LAYERS,WHOLE_LAYERS_DATA,SEMI_TRANSPARENT, MAX_VAL_OF_RANGE} from "../constants/actions";
import { useRef } from "react";
// import sliceMesh from "../utils/sliceMesh";
// import { useEffect } from "react";
// When using the Tauri API npm package:
import { invoke } from "@tauri-apps/api/core";
import Loader from "./Loader";
import LayerSlider from "./LayerSlider";
// When using the Tauri global script (if not using the npm package)
// Be sure to set `app.withGlobalTauri` in `tauri.conf.json` to true
// const invoke = window.__TAURI__.core.invoke;

// Invoke the command
// invoke("my_custom_command");

const MainContent = () => {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);
  const meshRef = useRef();
  const [loader,setLoader]=useState(false);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const objUrl = window.URL.createObjectURL(file);
    dispatch({
      type: FILE,
      payload: objUrl,
    });
  };
const total_layer=state.totalLayers;
  const handleSlice = async () => {
     setLoader((prev)=>!prev)
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
      const layerHeight=state.layerHeight;
      console.log("layer height",layerHeight);
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
        console.log("value of verticesToPoints array", verticesToPointsArray); 
       
        // let polygonsArrMap=null;
        // it is for each layer 
        const totalLayers=Object.keys(verticesToPointsArray).length;
        dispatch({
          type:TOTAL_LAYERS,
          payload:totalLayers,
        })
         dispatch({
          type:MAX_VAL_OF_RANGE,
          payload:totalLayers,
        })
        // console.log("length of obect key",length);
        const wholeLayerData=[];
        for (const key of Object.keys(verticesToPointsArray)) {
           const arrayOfAllPolygonArrays = [];
          const ylayerValue = key;
          const pointsArray = verticesToPointsArray[key];
          // console.log("value of pointsArray", pointsArray);
           const polygonsArrMap = await invoke("get_line_seg", {
            layerYValue:ylayerValue,
            flatArray: pointsArray,
           
          });
          setLoader(false)
          //  console.log("value for each layer",polygonsArrMap);
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
            wholeLayerData.push(arrayOfAllPolygonArrays);
   
        }
        dispatch({
          type:WHOLE_LAYERS_DATA,
          payload:wholeLayerData,
        })
       

      } catch (error) {
        console.error("Error during slicing:", error);
        return;
      }
    }
  };

  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);



  const handleLayerChange=(e)=>{
    
    const layerYValue=+e.target.value;
    console.log("layer input  value ",layerYValue);
      dispatch({
        type:LAYER_HEIGHT,
        payload:layerYValue,
      })
  }
  const handleReset=()=>{
    dispatch({
    type: LAYER_HEIGHT,
    payload: initialState.layerHeight,
  });

    console.log("clicked on reste button")
  }
const handleVisibility =()=>{
  const currentVisibility = state.semiTransparent;
  console.log("Clicked on handle visibility", currentVisibility);

  dispatch({
    type: SEMI_TRANSPARENT,
    payload: !currentVisibility, // toggle the value
  });
};

  return (
      <section className="main-container">
        {/*  left control panel */}
               <section className="left-control-panel">
                <div className="inputs">
                  {/* input for importing the file */}
                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>
                      <label htmlFor="">Import File</label>
                      <input type="file" onChange={handleFileInput}  />
                  </div>
                  {/* input for layer height */}
                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>  
                    <label htmlFor="">Layer Height</label>
                   <input
                    size="5"
                    type="text"
                    spellCheck="false"
                    id="layerHeight"
                    value={state.layerHeight}
                    onChange={handleLayerChange}
                  />
                  </div>
                  {/* input for selcting the number of top layer  */}
                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>  
                    <label htmlFor=""> Top Layer</label>
                    <input size="5" type="text" spellCheck="false" name="" id="" />
                  </div>
                  {/* Input for the numbert of base layer you want */}
                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>  
                    <label htmlFor="">Base Layer</label>
                    <input size="5" type="text" spellCheck="false" name="" id=""/>
                  </div>


                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>  
                    <label htmlFor="">Fill Density</label>
                    <input size="5" type="text" spellCheck="false" name="" id="" />
                  </div>
                  <div style={{display:"flex", flexDirection:'column', width:'100%'}}>  
                        <label htmlFor="cars">Fill pattern</label>
                        <select name="fill-pattern" id="cars">
                          <option value="linear">Linear</option>
                          <option value="hex">Hex</option>
                          <option value="grid">Grid</option>
                          <option value="taingle">Traingle</option>
                          <option value="gyroid">Gyroid</option>
                
                        </select>
                  </div>
                  
                </div>
                <div  className="btn-container">
                  <button onClick={handleSlice}>Slice</button>
                  <button onClick={handleReset}>Reset</button>
                  <button onClick={handleVisibility}>Visibilty</button>
                </div>
                  {loader ? <Loader/>: ""} 
              </section>
                {/* right section  */}
                <section className="right-panel">
               {total_layer?  <LayerSlider/>:""}
                  
                      <CanvasComp meshRef={meshRef} />
                </section>
      </section>
            
        
    
      
      
    

      

  );
};

export default MainContent;

//  have the left bar 
//   layer height--> top layer--> base layer