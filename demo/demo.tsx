import React from "react"
import { createRoot } from "react-dom/client"
import { createUndoRedo } from "react-undo-redo"
import { countReducer, decrement, increment } from "./test"

const { UndoRedoProvider, usePresent, useUndoRedo } =
  createUndoRedo(countReducer)

function App() {
  return (
    <UndoRedoProvider initialState={0}>
      <Counter />
    </UndoRedoProvider>
  )
}

function Counter() {
  const [count, dispatch] = usePresent()

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

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Controls />
      </div>
    </>
  )
}

function Controls() {
  const [undo, redo] = useUndoRedo()

  return (
    <>
      <button disabled={!undo.isPossible} onClick={() => undo()}>
        Undo
      </button>
      <button disabled={!redo.isPossible} onClick={() => redo()}>
        Redo
      </button>
    </>
  )
}

const container = document.getElementById("demo")

if (container) {
  const root = createRoot(container)

  root.render(<App />)
}
