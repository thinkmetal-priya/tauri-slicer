import React, { useEffect, useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useContext } from "react";
import { Context, DispatchCtx } from "../context";
import { GEOMETRY } from "../constants/actions";

const STLComp = ({ meshRef }) => {
  const state = useContext(Context);

  const dispatch = useContext(DispatchCtx);
 const transparent =state.semiTransparent;
  const [geom, setGeom] = useState(null);
  // const meshRef = useRef();
  let bbox = null;
  let positionY = null;
  useEffect(() => {
    if (!state.file) {
      return;
    }
    const loader = new STLLoader();
    loader.load(
      state.file,
      (geometry) => {
        console.log("Loaded geometry:", geometry);

        setGeom(geometry);

        dispatch({
          type: GEOMETRY,
          payload: geometry,
        });
      },
      undefined,
      (error) => {
        console.error("Error loading STL:", error);
      }
    );
  }, [state.file]);
    useEffect(()=>{
    console.log("value of transparent value in context",state.semiTransparent)
  },[state.semiTransparent])
  if (geom) {
    geom.computeVertexNormals();
    geom.computeBoundingBox();

    bbox = geom.boundingBox;
    positionY = bbox.min.y + 0.001;
  }

  return geom ? (
    <mesh ref={meshRef} geometry={geom} position={[0, 0, 0]}>
      <meshStandardMaterial color="red"   transparent opacity={state.semiTransparent? 0.5:1} />
    </mesh>
  ) : null;
};

export default STLComp;
