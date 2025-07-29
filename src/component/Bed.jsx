import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

function Bed({ url }) {
  const materials = useLoader(MTLLoader, "/Bed Assembly/bedV3.mtl");
  const obj = useLoader(OBJLoader, "/Bed Assembly/bedV3.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return (
    <mesh rotation={[-Math.PI / 2,0, 0]} position={[0, 0, -120]}>
      <primitive object={obj} />
      <ambientLight intensity={0.4} />
      <pointLight position={[-80, -250, 1]} intensity={999} color={0xffffff} />
      <pointLight position={[-20, -250, 1]} intensity={999} color={0xffffff} />
      <pointLight position={[90, -250, 1]} intensity={999} color={0xffffff} />
      <directionalLight
        intensity={2}
        position={[0, 10, 180]}
        shadow-mapSize-height={1512}
        shadow-mapSize-width={1512}
      />
    </mesh>
  );
}

export default Bed;
