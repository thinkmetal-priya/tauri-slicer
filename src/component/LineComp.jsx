import React, { useContext } from 'react'
import { Context } from '../context';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';

function LineComp() {
    const state = useContext(Context);
    const polygonVertices = state.polygonVerticesDebug;
    const points = [];

    if (polygonVertices && polygonVertices.pointsArray.length > 0) {
        for (let i = 0; i < polygonVertices.pointsArray.length; i += 3) {
            points.push([polygonVertices.pointsArray[i], polygonVertices.pointsArray[i + 1], polygonVertices.pointsArray[i + 2]]);
        }
    }

    return (
        <group>
            {points.length > 1 && (
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