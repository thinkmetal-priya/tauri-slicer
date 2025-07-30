

import React, { useContext } from 'react';
import { Context } from '../context';
import LineComp from './LineComp';
import { sortedArray } from 'three/src/animation/AnimationUtils.js';

const Layers = () => {
  const state = useContext(Context);
  const arrayOfpolygonsPerLayer = state.arrayOfpolyonsArrayPerLayer;
  // console.log("value of array of polygons per array ",arrayOfpolygonsPerLayer)

//   const sortedLayers = arrayOfpolygonsPerLayer.slice().sort((a, b) => {
//   const aY = a?.[0]?.[0]?.[0]?.[1] ?? 0; // Y of first point of first segment
//   const bY = b?.[0]?.[0]?.[0]?.[1] ?? 0;
//   return aY - bY;
// });
// console.log(" val of sortedLayers",sortedLayers)
  const wholeLayerData=state.wholeLayerData;
 const currentLayer=(state.currentLayerIndex);
console.log("value of current layer",currentLayer);
//     const filteredWhole =wholeLayerData.filter(arr =>
//   Array.isArray(arr) &&
//   arr.flat().length > 0
// );

// const filteredWhole = wholeLayerData
//   .map((layer, index) => ({ layer, index }))
//   .filter(({ layer }) =>
//     Array.isArray(layer) && layer.flat().length > 0
//   );
const filteredWhole = wholeLayerData
    .map((layer, index) => ({ layer, index }))
    .filter(({ layer }) => Array.isArray(layer) && layer.flat().length > 0);

console.log("filtered array",filteredWhole);
  const target = filteredWhole.find(item => item.index === currentLayer);
if (!target) return null;
console.log("target layers ",target);
const slicedArray=filteredWhole;
  return (
    <>
     
      
     {/* {filteredWhole.map(({ layer, index }) => {
  const [min, max] = visibleRange;
  if (index < min || index > max) return null;
  return <LineComp key={target.index} layer={index} polygons={target.layer} />;
    })} */}

<LineComp layer={target.index} polygons={target.layer} />



    </>
  );
};

export default Layers;
