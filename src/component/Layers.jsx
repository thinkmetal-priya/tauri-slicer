// import React, { useState } from 'react'
// import { useContext } from 'react'
// import { Context } from '../context'
// import LineComp from './LineComp'
// const Layers = () => {
// const state=useContext(Context);

// const arrayOfpolygonsPerLayer=state.arrayOfpolyonsArrayPerLayer;
// const [singleLayer,setSingleLayer]=useState(null);
// for(let i=0;i<arrayOfpolygonsPerLayer.length;i++){
// setSingleLayer(arrayOfpolygonsPerLayer[i]);
// }

//   return (
//     <> {
//         arrayOfpolygonsPerLayer.length>0 &&(    <LineComp layer={singleLayer}/>    )
//     }
    
//     </>
//   )
// }

// export default Layers

import React, { useContext } from 'react';
import { Context } from '../context';
import LineComp from './LineComp';

const Layers = () => {
  const state = useContext(Context);
  const arrayOfpolygonsPerLayer = state.arrayOfpolyonsArrayPerLayer;

  return (
    <>
      {arrayOfpolygonsPerLayer.length > 0 &&
        arrayOfpolygonsPerLayer.map((layerPolygons, index) => (
          <LineComp key={index} layer={index} polygons={layerPolygons} />
        ))}
    </>
  );
};

export default Layers;
