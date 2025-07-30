import { createContext } from "react";
export const Context = createContext(null);
export const DispatchCtx = createContext(null);
import {
  FILE,
  GEOMETRY,
  SLICING,
  TOTALVERTICES,
  VERTICES,
POLYGON_VERTICES_DEBUG,
POLYGONS_ARRAY_PER_LAYER,
ARRAY_OF_POLYGONS_ARRAY_PER_LAYER,
LAYER_HEIGHT,
TOTAL_LAYERS,
 SLICING_COMPLETE,
 WHOLE_LAYERS_DATA,
SEMI_TRANSPARENT,
MIN_VAL_OF_RANGE,
MAX_VAL_OF_RANGE,
} from "./constants/actions";
import Layers from "./component/Layers";

export const initialState = {
  file: null,
  geometry: null,
  slicing: false,
  totalVertices: null,
  vertices: [],
  segments: [],
  polygonVerticesDebug: null,
  polyonsArrayPerLayer:[],
  arrayOfpolyonsArrayPerLayer:[],
  layerHeight:0.5,
  totalLayers:null,
  slicingComplete:false,
  wholeLayerData:[],
  semiTransparent:false,
  minValOfRange:0,
  maxValOfRange:null,

};
//  reducer fucntion
export function reducer(state, action) {
  switch (action.type) {
    case FILE: {
      return { ...state, file: action.payload };
    }
    case GEOMETRY: {
      console.log("palyload  value ", action.payload);
      return { ...state, geometry: action.payload };
    }
    case TOTALVERTICES: {
      return { ...state, totalVertices: action.payload };
    }
    case VERTICES: {
      return { ...state, vertices: action.payload };
    }
    
    case SLICING: {
      return { ...state, slicing: action.payload };
    }
    case POLYGON_VERTICES_DEBUG: {
      return { ...state, polygonVerticesDebug: action.payload };
    }
    case POLYGONS_ARRAY_PER_LAYER:{
      return{...state,polyonsArrayPerLayer:action.payload}
    }
    case ARRAY_OF_POLYGONS_ARRAY_PER_LAYER:{
      return {...state,arrayOfpolyonsArrayPerLayer:[
      ...state.arrayOfpolyonsArrayPerLayer,
      action.payload,
    ],}
    }
    case LAYER_HEIGHT:{
      return{...state,layerHeight:action.payload}
    }
    case TOTAL_LAYERS:{
      return {...state,totalLayers:action.payload}
    }
    case SLICING_COMPLETE:{
      return {
        ...state,slicingComplete:action.payload
      }
    }
    case WHOLE_LAYERS_DATA:{
      return {
        ...state,wholeLayerData:action.payload
      }
    }
    case SEMI_TRANSPARENT:{
      return {
        ...state,semiTransparent:action.payload
      }
    }
      case MIN_VAL_OF_RANGE:{
      return {
        ...state,minValOfRange:action.payload
      }
    }
      case MAX_VAL_OF_RANGE:{
      return {
        ...state,maxValOfRange:action.payload
      }
    }
    default: {
      throw new Error("Action not registered:" + action.type);
    }
  }
}
