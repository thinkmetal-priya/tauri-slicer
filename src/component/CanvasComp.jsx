import React from "react";
import { Canvas } from "@react-three/fiber";
import STLComp from "./STLComp";
import { OrbitControls } from "@react-three/drei";
import Bed from "./Bed";
import DebugComp from "./DebugComp";
// import LineComp from "./LineComp";
import Layers from "./Layers";
const CanvasComp = ({ meshRef }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 300], near: 1, far: 1000 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight color="white" position={[0, 0, 5]} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />

      <Bed />
      <STLComp meshRef={meshRef} />
      {/* <DebugComp/> */}
      <Layers/>
    </Canvas>
  );
};

export default CanvasComp;
