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
      camera={{ position: [0, 100, 300], near: 0.002, far: 5000 }}
      style={{ width: "100vw", height: "100vh" ,color:'#808080'}}
    >
      <ambientLight intensity={Math.PI} color={"white"} />
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
   
      <Layers/>
      
    </Canvas>
  );
};

export default CanvasComp;
