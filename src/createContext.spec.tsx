import React from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { createContext } from "./createContext"
import { countReducer, increment } from "./fixtures"

describe("createContext", () => {
  it("should provide access to the present state.", () => {
    const { UndoRedoProvider, usePresent } = createContext(countReducer)
    const Component = () => {
      const [state] = usePresent()

      return <div>{state}</div>
    }

    render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    expect(screen.queryByText("0")).toBeInTheDocument()
  })

  it("should be possible to undo an update.", async () => {
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

    render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(screen.queryByText("1")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Undo" }))

    expect(screen.queryByText("0")).toBeInTheDocument()
  })

  it("should be possible to redo an update.", async () => {
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

    render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))
    await userEvent.click(screen.getByRole("button", { name: "Undo" }))
    await userEvent.click(screen.getByRole("button", { name: "Redo" }))

    expect(screen.queryByText("1")).toBeInTheDocument()
  })

  it("should be possible to access information whether undo is possible.", async () => {
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

    render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled()
  })

  it("should be possible to access information whether redo is possible.", async () => {
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

    render(
      <UndoRedoProvider initialState={0}>
        <Component />
      </UndoRedoProvider>
    )

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Undo" }))

    expect(screen.getByRole("button", { name: "Redo" })).not.toBeDisabled()
  })
})
