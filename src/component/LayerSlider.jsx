


import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { useContext } from 'react';
import { Context,DispatchCtx } from '../context';
function LayerSlider() {
    const state=useContext(Context);
    const minVal=0;
    const maxVal=state.totalLayers;
    console.log("max value of range",maxVal);
  const [range, setRange] = useState([minVal, maxVal]);

useEffect(()=>{
    setRange([minVal,maxVal])
},[maxVal])

  const handleRangeChange = ([min, max]) => {
    if (min > max) return;
    setRange([min, max]);
  };




  const decreaseRange = () => {
    setRange(([min, max]) => [
      Math.max(0, min - 1),
      max
    ]);
  };

  const increaseRange = () => {
    setRange(([min, max]) => [
      min,
      Math.min(maxVal, max + 1)
    ]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Left Button */}
        <button onClick={decreaseRange} style={{ marginRight: '10px' }}>
          ◀
        </button>

        {/* Range Slider */}
        <div style={{ flex: 1, padding: '0 10px' }}>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            min={0}
            max={maxVal}
            value={range}
            onChange={handleRangeChange}
            pearling
            minDistance={1}
          />
        </div>

        {/* Right Button */}
        <button onClick={increaseRange} style={{ marginLeft: '10px' }}>
          ▶
        </button>
      </div>

      {/* Display values */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>Min:</strong> {range[0]}
        </div>
        <div>
          <strong>Max:</strong> {range[1]}
        </div>
      </div>

      {/* Inline styles or CSS for slider */}
      <style jsx>{`
        .horizontal-slider {
          width: 100%;
          height: 5px;
          background: #c6c6c6;
          border-radius: 5px;
        }
        .thumb {
          height: 20px;
          width: 20px;
          background: #28604fff;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -5px;
        }
        .track {
          background: #25daa5;
          height: 10px;
          border-radius:4px;
        }
      `}</style>
    </div>
  );
}

export default LayerSlider;
