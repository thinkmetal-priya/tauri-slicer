import React, { useEffect, useState, useContext } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Context, DispatchCtx } from "../context";
import { GEOMETRY, POSITIONY } from "../constants/actions";

const STLComp = ({ meshRef }) => {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);

  const matcapTexture = useTexture(
    "src/assets/texture/2A2A2A_DBDBDB_6A6A6A_949494.png"
  );

  const transparent = state.semiTransparent;
  const positionY = state.positionY; // Loaded from context
  const [geom, setGeom] = useState(null);

  useEffect(() => {
    if (!state.file) {
      if (geom) {
        geom.dispose();
        setGeom(null);
      }
      return;
    }

    const loader = new STLLoader();
    loader.load(
      state.file,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);

        // Move model to center
        geometry.translate(-center.x, -center.y, -center.z);

        // Move model to sit flat on grid
        const minY = geometry.boundingBox.min.y - center.y;
        dispatch({ type: POSITIONY, payload: -minY });

        setGeom(geometry);
        dispatch({ type: GEOMETRY, payload: geometry });
      },
      undefined,
      (error) => console.error("STL load error:", error)
    );
  }, [state.file, state.positionY]);

  if (!geom) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geom}
      position={[0, positionY, 0]}
      scale={[2, 2, 2]}
    >
      <meshMatcapMaterial
        matcap={matcapTexture}
        transparent
        opacity={transparent ? 0.2 : 1}
      />
    </mesh>
  );
};

export default STLComp;
