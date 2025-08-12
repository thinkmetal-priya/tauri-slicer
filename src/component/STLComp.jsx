import React, { useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useContext } from "react";
import { Context, DispatchCtx } from "../context";
import { GEOMETRY } from "../constants/actions";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const STLComp = ({ meshRef }) => {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);

  const matcapTexture = useTexture(
    "src/assets/texture/2A2A2A_DBDBDB_6A6A6A_949494.png"
  );

  const transparent = state.semiTransparent;
  const [geometry, setGeometry] = useState(null);
  const [positionY, setPositionY] = useState(0); // vertical lift
  useEffect(() => {
    console.log("culling plane ", state?.cullingPlane);
  }, [state?.cullingPlane]);
  useEffect(() => {
    // if (!state.file) return;
    if (!state.file) {
      if (geometry) {
        geometry.dispose();
        setGeometry(null);
      }
      return;
    }

    const loader = new STLLoader();
    loader.load(
      state.file,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        // === CENTER geometry in X and Z ===
        const bbox = geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geometry.translate(-center.x, 0, -center.z); // horizontal center only

        // === VERTICALLY lift to sit on the grid ===
        geometry.computeBoundingBox(); // again after translating
        const newMinY = geometry.boundingBox.min.y;
        setPositionY(-newMinY); // this sets mesh position to lift it

        setGeometry(geometry);

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

  if (!geometry) return null;

  return state.cullingPlane ? (
    <group>
      {/* Solid mesh below the plane */}
      <mesh ref={meshRef} geometry={geometry} position={[0, positionY, 0]}>
        <meshMatcapMaterial
          side={2}
          matcap={matcapTexture}
          transparent
          opacity={transparent ? 0.2 : 1}
          clippingPlanes={state.cullingPlane && [state.cullingPlane]}
          clipShadows
        />
      </mesh>

      {/* Transparent mesh above the plane */}
      <mesh ref={meshRef} geometry={geometry} position={[0, positionY, 0]}>
        <meshMatcapMaterial
          side={2}
          matcap={matcapTexture}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  ) : (
    <mesh ref={meshRef} geometry={geometry} position={[0, positionY, 0]}>
      <meshMatcapMaterial
        side={2}
        matcap={matcapTexture}
        transparent={false}
        opacity={transparent ? 0.2 : 1}
      />
    </mesh>
  );
};

export default STLComp;
