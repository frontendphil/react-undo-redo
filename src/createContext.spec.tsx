import React from "react"

import { render, screen, renderHook } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { createContext } from "./createContext"
import { countReducer, increment } from "./fixtures"

describe("createContext", () => {
  it("should provide access to the present state.", () => {
    const { UndoRedoProvider, usePresent } = createContext(countReducer)

    const { result } = renderHook(() => usePresent(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>{children}</UndoRedoProvider>
      ),
    })

    expect(result.current).toEqual([0, expect.anything()])
  })

  it("should be possible to undo an update.", async () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()
      const [undo] = useUndoRedo()

      return (
        <>
          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
        </>
      )
    }

    const { result } = renderHook(() => usePresent(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>
          {children}

          <Component />
        </UndoRedoProvider>
      ),
    })

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(result.current).toEqual([1, expect.anything()])

    await userEvent.click(screen.getByRole("button", { name: "Undo" }))

    expect(result.current).toEqual([0, expect.anything()])
  })

  it("should be possible to redo an update.", async () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()
      const [undo, redo] = useUndoRedo()

      return (
        <>
          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
          <button onClick={() => redo()}>Redo</button>
        </>
      )
    }

    const { result } = renderHook(() => usePresent(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>
          {children}

          <Component />
        </UndoRedoProvider>
      ),
    })

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))
    await userEvent.click(screen.getByRole("button", { name: "Undo" }))
    await userEvent.click(screen.getByRole("button", { name: "Redo" }))

    expect(result.current).toEqual([1, expect.anything()])
  })

  it("should be possible to access information whether undo is possible.", async () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()
      const [undo] = useUndoRedo()

      return (
        <>
          <button onClick={() => dispatch(increment())}>Increment</button>

          <button disabled={!undo.isPossible} onClick={() => undo()}>
            Undo
          </button>
        </>
      )
    }

    renderHook(() => usePresent(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>
          {children}

          <Component />
        </UndoRedoProvider>
      ),
    })

    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled()
  })

  it("should be possible to access information whether redo is possible.", async () => {
    const { UndoRedoProvider, usePresent, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()
      const [undo, redo] = useUndoRedo()

      return (
        <>
          <button onClick={() => dispatch(increment())}>Increment</button>

          <button disabled={!undo.isPossible} onClick={() => undo()}>
            Undo
          </button>
          <button disabled={!redo.isPossible} onClick={() => redo()}>
            Redo
          </button>
        </>
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

  it("should be possible to access the past", async () => {
    const { UndoRedoProvider, usePresent, usePast, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()

      return <button onClick={() => dispatch(increment())}>Increment</button>
    }

    const { result } = renderHook(() => usePast(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>
          {children}

          <Component />
        </UndoRedoProvider>
      ),
    })

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))

    expect(result.current).toEqual([0])
  })

  it("should be possible to access the future", async () => {
    const { UndoRedoProvider, usePresent, useFuture, useUndoRedo } =
      createContext(countReducer)

    const Component = () => {
      const [, dispatch] = usePresent()
      const [undo] = useUndoRedo()

      return (
        <>
          <button onClick={() => dispatch(increment())}>Increment</button>
          <button onClick={() => undo()}>Undo</button>
        </>
      )
    }

    const { result } = renderHook(() => useFuture(), {
      wrapper: ({ children }) => (
        <UndoRedoProvider initialState={0}>
          {children}

          <Component />
        </UndoRedoProvider>
      ),
    })

    await userEvent.click(screen.getByRole("button", { name: "Increment" }))
    await userEvent.click(screen.getByRole("button", { name: "Undo" }))

    expect(result.current).toEqual([1])
  })
})
