import React, { useContext } from 'react'
import { Context } from '../context';
import { useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function DebugComp() {

    const Three = useThree()
    const state = useContext(Context);
    const polygonVertices = state.polygonVerticesDebug;
    const reneringObjs =[]
 const initTime=window.performance.now()
    if(polygonVertices&& polygonVertices.pointsArray.length > 0){ 
        
        let index = 0;

        for (index = 0; index < polygonVertices.pointsArray.length; ) {
            const x = polygonVertices.pointsArray[index++];
            const y = polygonVertices.pointsArray[index++];
            const z = polygonVertices.pointsArray[index++];
            
           
            reneringObjs.push( 
                (<Sphere
                key={index}
                args={[0.05, 16, 16]}
                position={[x,y,z]}
                color="red"/>)
            )

        }}
        const finishTime=window.performance.now()
        console.log("DebugComp rendering time:", finishTime - initTime);
    


    return (
        <group>
            {reneringObjs}
        </group>
    )
  
}

export default DebugComp