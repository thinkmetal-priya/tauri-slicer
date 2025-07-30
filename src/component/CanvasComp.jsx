import React, { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import STLComp from "./STLComp";
import { OrbitControls } from "@react-three/drei";
import Bed from "./Bed";
import DebugComp from "./DebugComp";
// import LineComp from "./LineComp";
import { Context } from "../context";
import { DispatchCtx } from "../context";
import Layers from "./Layers";
const CanvasComp = ({ meshRef }) => {
  const state=useContext(Context);
  const minLayernumber=state.minValOfRange;
  const maxLayerNuber=state.maxValOfRange;
  return (
    <Canvas
      camera={{ position: [0, 100, 300], near: 0.002, far: 5000 }}
      style={{ width: "100vw", height: "100vh" ,backgroundColor: 'white' }}
    >
      {/* <ambientLight intensity={Math.PI}  /> */}
      {/* <directionalLight color="white" position={[0, 0, 5]} /> */}
      {/* <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      /> */}
      {/* <pointL ight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      <OrbitControls />

      {/* <Bed /> */}
      <STLComp meshRef={meshRef} />
   
      <Layers />
      
    </Canvas>
  );
};

export default CanvasComp;
