import invariant from "tiny-invariant"

export enum CountActionTypes {
  INCREMENT = "@@count/increment",
  DECREMENT = "@@count/decrement",
  NOOP = "@@count/noop",
}

type IncrementAction = {
  type: CountActionTypes.INCREMENT
}

type DecrementAction = {
  type: CountActionTypes.DECREMENT
}

type NoOpAction = {
  type: CountActionTypes.NOOP
}

export type CountActions = IncrementAction | DecrementAction | NoOpAction

export const countReducer = (state: number, action: CountActions): number => {
  invariant(state != null, "Count reducer needs an initial state")

  switch (action.type) {
    case CountActionTypes.INCREMENT:
      return state + 1
    case CountActionTypes.DECREMENT:
      return state - 1
    case CountActionTypes.NOOP:
      return state
    default:
      invariant(false, "Count reducer received an unknown action.")
  }
}

export const increment = (): IncrementAction => ({
  type: CountActionTypes.INCREMENT,
})

export const decrement = (): DecrementAction => ({
  type: CountActionTypes.DECREMENT,
})

export const noop = (): NoOpAction => ({ type: CountActionTypes.NOOP })
