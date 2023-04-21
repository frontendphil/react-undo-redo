import React, {
  ComponentType,
  ReactNode,
  createContext as createReactContext,
  useCallback,
  useContext,
  useReducer,
} from "react"

import {
  PresentReducer,
  UndoRedoActions,
  UndoRedoReducer,
  UndoRedoState,
  createReducer,
  redo as redoAction,
  undo as undoAction,
} from "./createReducer"

type Dispatch<Actions> = (action: Actions) => void

type UndoRedoContext<Present, Actions> = [
  state: UndoRedoState<Present>,
  dispatch: Dispatch<UndoRedoActions<Actions>>
]

type UndoRedoProviderProps<Present> = {
  children: ReactNode
  initialState: Present
  past?: Present[]
  future?: Present[]
}

type Undo = { (): void; isPossible: boolean }
type Redo = { (): void; isPossible: boolean }

export function createContext<Present, Actions extends {}>(
  reducer: PresentReducer<Present, Actions>
): {
  UndoRedoProvider: ComponentType<UndoRedoProviderProps<Present>>
  usePresent: () => [Present, Dispatch<Actions>]
  usePast: () => Present[]
  useFuture: () => Present[]
  useUndoRedo: () => [undo: Undo, redo: Redo]
} {
  const Context = createReactContext<UndoRedoContext<Present, Actions>>([
    {
      past: () => {
        throw new Error("Undo/Redo past accessed outside of UndoRedoContext.")
      },
      present: () => {
        throw new Error(
          "Undo/Redo present accessed outside of UndoRedoContext."
        )
      },
      future: () => {
        throw new Error("Undo/Redo future accessed outside of UndoRedoContext.")
      },
    },
    function invalidDispatch() {
      throw new Error("Undo/Redo dispatch called outside of UndoRedoContext.")
    },
  ])

  const undoRedoReducer = createReducer(reducer)

  function UndoRedoProvider({
    children,
    initialState,
    past = [],
    future = [],
  }: UndoRedoProviderProps<Present>) {
    const initialUndoRedoState = {
      past: () => past,
      present: () => initialState,
      future: () => future,
    }

    const [state, dispatch] = useReducer<
      UndoRedoReducer<Present, UndoRedoActions<Actions>>
    >(undoRedoReducer, initialUndoRedoState)

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    )
  }

  function usePresent(): [state: Present, dispatch: Dispatch<Actions>] {
    const [state, dispatch] = useContext(Context)

    return [state.present(), dispatch]
  }

  function usePast(): Present[] {
    const [state] = useContext(Context)

    return state.past()
  }

  function useFuture(): Present[] {
    const [state] = useContext(Context)

    return state.future()
  }

  function useUndoRedo(): [undo: Undo, redo: Redo] {
    const [state, dispatch] = useContext(Context)

    const undo = useCallback(() => dispatch(undoAction()), [dispatch]) as Undo

    undo.isPossible = state.past().length > 0

    const redo = useCallback(() => dispatch(redoAction()), [dispatch]) as Redo

    redo.isPossible = state.future().length > 0

    return [undo, redo]
  }

  return { UndoRedoProvider, usePresent, useUndoRedo, usePast, useFuture }
}
