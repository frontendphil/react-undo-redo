import React from "react";
import { render } from "react-dom";
import { createUndoRedo } from "react-undo-redo";
import { countReducer, decrement, increment } from "test";

import { redo, undo } from "../src/createReducer";

const { UndoRedoProvider, usePresent, useUndoRedo } = createUndoRedo(
  countReducer,
  0
);

function App() {
  return (
    <UndoRedoProvider>
      <Counter />
    </UndoRedoProvider>
  );
}

function Counter() {
  const [count, dispatch] = usePresent();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button onClick={() => dispatch(decrement())}>-</button>

        <h1 style={{ marginLeft: 50, marginRight: 50 }}>{count}</h1>

        <button onClick={() => dispatch(increment())}>+</button>
      </div>

      <Controls />
    </>
  );
}

function Controls() {
  const [undo, redo] = useUndoRedo();

  return (
    <>
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>
    </>
  );
}

render(<App />, document.getElementById("demo"));
