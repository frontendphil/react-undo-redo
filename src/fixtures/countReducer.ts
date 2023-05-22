import invariant from "tiny-invariant"

export enum CountActionTypes {
  INCREMENT = "@@count/increment",
  DECREMENT = "@@count/decrement",
}

type IncrementAction = {
  type: CountActionTypes.INCREMENT
}

type DecrementAction = {
  type: CountActionTypes.DECREMENT
}

export type CountActions = IncrementAction | DecrementAction

export const countReducer = (state: number, action: CountActions): number => {
  invariant(state != null, "Count reducer needs an initial state")

  switch (action.type) {
    case CountActionTypes.INCREMENT:
      return state + 1
    case CountActionTypes.DECREMENT:
      return state - 1
    default:
      invariant(false, "Count reducer received an unknown action.")
  }
}

export const increment = (): IncrementAction =>
  ({ type: CountActionTypes.INCREMENT } as const)
export const decrement = (): DecrementAction =>
  ({ type: CountActionTypes.DECREMENT } as const)
