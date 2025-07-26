import React, { useContext, useState } from 'react'
import { Context } from '../context';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { div } from 'three/tsl';

function LineComp({layer,polygons}) {
    const state = useContext(Context);
    // const arrayOfpolygonsPerLayer=state.arrayOfpolyonsArrayPerLayer
    // const polygonsArray = state.polyonsArrayPerLayer||[];
    // const [points,setPoint]=useState([])
    const points = [];
    
    // console.lo<g("polygons in array", polygonsArray);
    for(let i=0;i<polygons[0].length;i++){
        const singlePolygon=polygons[0][i];
        if (singlePolygon && singlePolygon.length > 0) {
        // const localPointsArray=[];
        for (let i = 0; i < singlePolygon.length; i++) {

            for(let j=0;j<singlePolygon[i].length;j++){
                points.push(singlePolygon[i][j],singlePolygon[i][j++],singlePolygon[i][j++]);
                // setPoint(localPointsArray)
            }
        }
    }
    }
 

    return (
        <group>
            { points .length > 1 && (
                <Line
                    points={points}
                    color="blue"
                    lineWidth={1}
                />
            )}
        </group>
       
    )
}

export default LineComp