import React, { useState, useEffect, useContext } from "react";
import * as THREE from "three";
import ReactSlider from "react-slider";
import { Context, DispatchCtx } from "../context";
import { CURRENT_LAYER_INDEX, LP } from "../constants/actions";

function SingleLayerSlider() {
  const state = useContext(Context);
  const dispatch = useContext(DispatchCtx);
  const maxVal = state.totalLayers || 100;
  const currentLayer = state.currentLayerIndex || 0;

  const [layer, setLayer] = useState(currentLayer);

  const handleSliderChange = (val) => {
    console.log("value in handle Slice", val);
    setLayer(val);
    if (layer !== 0) {
      dispatch({
        type: LP,
        payload: new THREE.Plane(
          new THREE.Vector3(0, -1, 0),
          val * state.layerHeight
        ),
      });
    }
    dispatch({
      type: CURRENT_LAYER_INDEX,
      payload: val,
    });
  };

  useEffect(() => {
    console.log("the value of current layer index", state.currentLayerIndex);
  }, [state.currentLayerIndex]);

  const decreaseLayer = () => {
    const newVal = Math.max(0, layer - 1);
    setLayer(newVal);
    dispatch({ type: CURRENT_LAYER_INDEX, payload: newVal });
  };

  const increaseLayer = () => {
    const newVal = Math.min(maxVal, layer + 1);
    setLayer(newVal);
    dispatch({ type: CURRENT_LAYER_INDEX, payload: newVal });
  };

  useEffect(() => {
    if (layer !== 0) {
      dispatch({
        type: LP,
        payload: new THREE.Plane(
          new THREE.Vector3(0, -1, 0),
          layer * state.layerHeight
        ),
      });
    }
  }, [layer]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "80%",
          alignItems: "center",
          margin: "0 auto",
          paddingTop: "10px",
        }}
      >
        <button onClick={decreaseLayer} style={{ marginRight: "10px" }}>
          ◀
        </button>

        <div style={{ flex: 1, padding: "0 10px" }}>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            min={0}
            max={maxVal}
            value={layer}
            onChange={handleSliderChange}
          />
        </div>

        <button onClick={increaseLayer} style={{ marginLeft: "10px" }}>
          ▶
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <strong>Current Layer:</strong> {layer}
      </div>

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
          background: #326857ff;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -5px;
        }
        .track {
          background: #60eac1ff;
          height: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default SingleLayerSlider;
