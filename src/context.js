import { createContext } from "react";
export const Context = createContext(null);
export const DispatchCtx = createContext(null);
import {
  FILE,
  GEOMETRY,
  SLICING,
  TOTALVERTICES,
  VERTICES,
POLYGON_VERTICES_DEBUG
} from "./constants/actions";

export const initialState = {
  file: null,
  geometry: null,
  slicing: false,
  totalVertices: null,
  vertices: [],
  segments: [],
  polygonVerticesDebug: null, // Initialize polygonVerticesDebug
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
    default: {
      throw new Error("Action not registered:" + action.type);
    }
  }
}
