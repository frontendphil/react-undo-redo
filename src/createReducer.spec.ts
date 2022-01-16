import { createReducer, redo, undo } from "./createReducer"
import { countReducer, increment } from "./test"

describe("create reducer", () => {
  const initialState = {
    past: [],
    present: 0,
    future: [],
  }

  it("should move the current present into the past when an action is processed.", () => {
    const reducer = createReducer(countReducer)

    const updatedState = reducer(initialState, increment())

    expect(updatedState).toHaveProperty("past", [0])
    expect(updatedState).toHaveProperty("present", 1)
  })

  it("should be possible to undo an action.", () => {
    const reducer = createReducer(countReducer)

    const updatedState = reducer(initialState, increment())
    const revertedState = reducer(updatedState, undo())

    expect(revertedState).toHaveProperty("past", [])
    expect(revertedState).toHaveProperty("present", initialState.present)
  })

  it("should be possible to redo an action.", () => {
    const reducer = createReducer(countReducer)

    const updatedState = reducer(initialState, increment())
    const revertedState = reducer(updatedState, undo())
    const restoredState = reducer(revertedState, redo())

    expect(restoredState).toHaveProperty("past", [initialState.present])
    expect(restoredState).toHaveProperty("present", updatedState.present)
  })
})
