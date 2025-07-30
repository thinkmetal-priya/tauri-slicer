

import React, { useContext } from 'react';
import { Context } from '../context';
import LineComp from './LineComp';

const Layers = () => {
  const state = useContext(Context);
  const arrayOfpolygonsPerLayer = state.arrayOfpolyonsArrayPerLayer;
  const wholeLayerData=state.wholeLayerData;
 

    const filteredWhole =wholeLayerData.filter(arr =>
  Array.isArray(arr) &&
  arr.flat().length > 0
);
console.log("filtered array",filteredWhole);
const slicedArray=filteredWhole;
  return (
    <>
      {slicedArray.length > 0 &&
        slicedArray.map((layerPolygons, index) => (
          
          <LineComp key={index} layer={index} polygons={layerPolygons}/>
        ))}
     
    </>
  );
};

export default Layers;
