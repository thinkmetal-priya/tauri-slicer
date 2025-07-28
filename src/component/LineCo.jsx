import React from 'react'
import { Line } from '@react-three/drei';
const LineCo = ({points}) => {
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

export default LineCo