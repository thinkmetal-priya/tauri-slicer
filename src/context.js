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
  CURRENT_LAYER_INDEX,
  TOP_LAYERS,
  BASE_LAYERS,
  POSITIONY,
  CLEAR_FILE,
  INFILL_DENSITY,
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
  polyonsArrayPerLayer: [],
  arrayOfpolyonsArrayPerLayer: [],
  layerHeight: 0.2,
  totalLayers: null,
  slicingComplete: false,
  wholeLayerData: [],
  semiTransparent: false,
  minValOfRange: 0,
  maxValOfRange: null,
  currentLayerIndex: 0,
  topLayers: 3,
  baseLayers: 3,
  positionY: 0,
  infillDensity: 2,
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
    case POLYGONS_ARRAY_PER_LAYER: {
      return { ...state, polyonsArrayPerLayer: action.payload };
    }
    case ARRAY_OF_POLYGONS_ARRAY_PER_LAYER: {
      return {
        ...state,
        arrayOfpolyonsArrayPerLayer: [
          ...state.arrayOfpolyonsArrayPerLayer,
          action.payload,
        ],
      };
    }
    case LAYER_HEIGHT: {
      return { ...state, layerHeight: action.payload };
    }
    case TOTAL_LAYERS: {
      return { ...state, totalLayers: action.payload };
    }
    case SLICING_COMPLETE: {
      return {
        ...state,
        slicingComplete: action.payload,
      };
    }
    case WHOLE_LAYERS_DATA: {
      return {
        ...state,
        wholeLayerData: action.payload,
      };
    }
    case SEMI_TRANSPARENT: {
      return {
        ...state,
        semiTransparent: action.payload,
      };
    }
    case MIN_VAL_OF_RANGE: {
      return {
        ...state,
        minValOfRange: action.payload,
      };
    }
    case MAX_VAL_OF_RANGE: {
      return {
        ...state,
        maxValOfRange: action.payload,
      };
    }
    case CURRENT_LAYER_INDEX: {
      return {
        ...state,
        currentLayerIndex: action.payload,
      };
    }
    case TOP_LAYERS: {
      return { ...state, topLayers: action.payload };
    }
    case BASE_LAYERS: {
      return { ...state, baseLayers: action.payload };
    }
    case INFILL_DENSITY: {
      return { ...state, infillDensity: action.payload };
    }
    case POSITIONY: {
      return { ...state, positionY: action.payload };
    }
    case CLEAR_FILE:
      return {
        ...state,
        file: null,
        geometry: null,
      };

    default: {
      throw new Error("Action not registered:" + action.type);
    }
  }
}
