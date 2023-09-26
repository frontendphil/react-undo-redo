import { createReducer, redo, undo } from "./createReducer"
import {
  CountActionTypes,
  CountActions,
  countReducer,
  increment,
  noop,
} from "./fixtures"

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

  describe("with `track` callback", () => {
    it("moves the current present into the past when `track` callback returns `true`", () => {
      const reducer = createReducer(countReducer, { track: () => true })

      const { past, present } = reducer(initialState, increment())

      expect(past()).toEqual([0])
      expect(present()).toEqual(1)
    })

    it("updates the current present without changing the past and the future, when `track` callback returns `false`", () => {
      const trackOnlyIncrements = (action: CountActions) =>
        action.type === CountActionTypes.DECREMENT
      const reducer = createReducer(countReducer, {
        track: trackOnlyIncrements,
      })

      const untrackedState = reducer(
        { past: () => [0], present: () => 1, future: () => [2] },
        increment(),
      )

      expect(untrackedState.past()).toEqual([0])
      expect(untrackedState.present()).toEqual(2)
      expect(untrackedState.future()).toEqual([2])
    })

    it("does not change past, present, and future when the state did not update", () => {
      const reducer = createReducer(countReducer)

      const updatedState = reducer(
        { past: () => [0], present: () => 1, future: () => [2] },
        noop(),
      )

      expect(updatedState.past()).toEqual([0])
      expect(updatedState.present()).toEqual(1)
      expect(updatedState.future()).toEqual([2])
    })
  })
})
