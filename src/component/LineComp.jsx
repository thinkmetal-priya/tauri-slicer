import React, { useContext, useState } from 'react'
import { Context } from '../context';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { div } from 'three/tsl';
import LineCo from './LineCo';

function LineComp({layer,polygons}) {
    const state = useContext(Context);


    return (
  <>
    {polygons[0].map((polygon, index) => {
      const points = [];
      for (let edge of polygon) {
        const [start, end] = edge;
        if (start.length === 3 && end.length === 3) {
          points.push(start, end);
        }
      }
      return <LineCo key={index} points={points} />;
    })}
  </>
);

}

export default LineComp