import { useEffect, useState, useReducer, use } from "react";
import CanvasComp from "./component/CanvasComp";
// import STLLoader from "three/exaples/jsm/loaders/STLLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import "./App.css";
// import Slider from "./component/Slider";
// import sliceMesh from "./utils/sliceMesh";
import MainContent from "./component/MainContent";
import { initialState, reducer, Context, DispatchCtx } from "./context";
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // useEffect(() => {
  //   console.log("states in app", state);
  // }, [state]);
  return (
    <Context.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        <div className="App">
          {/* <Sidebar /> */}
          <MainContent />
        </div>
      </DispatchCtx.Provider>
    </Context.Provider>
  );
};
export default App;
