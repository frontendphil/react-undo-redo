import React from "react"

import { fireEvent, render } from "@testing-library/react"

import { createContext } from "./createContext"
import { countReducer, increment } from "./fixtures"

describe("createContext", () => {
  it("should provide access to the present state.", () => {
    const { UndoRedoProvider, usePresent } = createContext(countReducer)
    const Component = () => {
      const [state] = usePresent()

      return <div>{state}</div>
    }

    const { queryByText } = render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    expect(queryByText("0")).toBeInTheDocument()
  })

  it("should be possible to undo an update.", () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [state, dispatch] = usePresent()
      const [undo] = useUndoRedo()

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
        </div>
      )
    }

    const { queryByText, getByText } = render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    fireEvent.click(getByText("Increment"))

    expect(queryByText("1")).toBeInTheDocument()

    fireEvent.click(getByText("Undo"))

    expect(queryByText("0")).toBeInTheDocument()
  })

  it("should be possible to redo an update.", () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [state, dispatch] = usePresent()
      const [undo, redo] = useUndoRedo()

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
          <button onClick={() => redo()}>Redo</button>
        </div>
      )
    }

    const { queryByText, getByText } = render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    fireEvent.click(getByText("Increment"))
    fireEvent.click(getByText("Undo"))
    fireEvent.click(getByText("Redo"))

    expect(queryByText("1")).toBeInTheDocument()
  })

  it("should be possible to access information whether undo is possible.", () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [state, dispatch] = usePresent()
      const [undo] = useUndoRedo()

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button disabled={!undo.isPossible} onClick={() => undo()}>
            Undo
          </button>
        </div>
      )
    }

    const { getByText } = render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    expect(getByText("Undo")).toBeDisabled()

    fireEvent.click(getByText("Increment"))

    expect(getByText("Undo")).not.toBeDisabled()
  })

  it("should be possible to access information whether redo is possible.", () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [state, dispatch] = usePresent()
      const [undo, redo] = useUndoRedo()

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button disabled={!undo.isPossible} onClick={() => undo()}>
            Undo
          </button>
          <button disabled={!redo.isPossible} onClick={() => redo()}>
            Redo
          </button>
        </div>
      )
    }

    const { getByText } = render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    fireEvent.click(getByText("Increment"))

    expect(getByText("Redo")).toBeDisabled()

    fireEvent.click(getByText("Undo"))

    expect(getByText("Redo")).not.toBeDisabled()
  })
})
