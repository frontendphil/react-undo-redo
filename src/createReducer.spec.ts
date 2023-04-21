import { createReducer, redo, undo } from "./createReducer"
import { countReducer, increment } from "./fixtures"

describe("create reducer", () => {
  const initialState = {
    past: () => [],
    present: () => 0,
    future: () => [],
  }

  it("should move the current present into the past when an action is processed.", () => {
    const reducer = createReducer(countReducer)

    const { past, present } = reducer(initialState, increment())

    expect(past()).toEqual([0])
    expect(present()).toEqual(1)
  })

  it("should be possible to undo an action.", () => {
    const reducer = createReducer(countReducer)

    const updatedState = reducer(initialState, increment())
    const { past, present } = reducer(updatedState, undo())

    expect(past()).toEqual([])
    expect(present()).toEqual(initialState.present())
  })

  it("should be possible to redo an action.", () => {
    const reducer = createReducer(countReducer)

    const updatedState = reducer(initialState, increment())
    const revertedState = reducer(updatedState, undo())
    const { past, present } = reducer(revertedState, redo())

    expect(past()).toEqual([initialState.present()])
    expect(present()).toEqual(updatedState.present())
  })
})
