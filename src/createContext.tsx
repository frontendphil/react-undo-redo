import React, {
  ComponentType,
  ReactNode,
  createContext as createReactContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

import {
  PresentReducer,
  UndoRedoActions,
  UndoRedoReducer,
  UndoRedoState,
  createReducer,
  redo,
  undo,
} from "./createReducer";

type Dispatch<Actions> = (action: Actions) => void;

type UndoRedoContext<Present, Actions> = [
  state: UndoRedoState<Present>,
  dispatch: Dispatch<UndoRedoActions<Actions>>
];

type UndoRedoProviderProps = {
  children: ReactNode;
};

type Undo = () => void;
type Redo = () => void;

export function createContext<Present, Actions>(
  reducer: PresentReducer<Present, Actions>,
  initialState: Present
): {
  UndoRedoProvider: ComponentType<UndoRedoProviderProps>;
  usePresentState: () => [Present, Dispatch<Actions>];
  useUndoRedo: () => [undo: Undo, redo: Redo];
} {
  const initialUndoRedoState = {
    past: [],
    present: initialState,
    future: [],
  };

  const Context = createReactContext<UndoRedoContext<Present, Actions>>([
    initialUndoRedoState,
    function invalidDispatch() {
      throw new Error("Undo/Redo dispatch called outside of UndoRedoContext.");
    },
  ]);

  const undoRedoReducer = createReducer(reducer, initialState);

  function UndoRedoProvider({ children }: UndoRedoProviderProps) {
    const [state, dispatch] = useReducer<
      UndoRedoReducer<Present, UndoRedoActions<Actions>>
    >(undoRedoReducer, initialUndoRedoState);

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
  }

  function usePresentState(): [state: Present, dispatch: Dispatch<Actions>] {
    const [state, dispatch] = useContext(Context);

    return [state.present, dispatch];
  }

  function useUndoRedo(): [undo: Undo, redo: Redo] {
    const [, dispatch] = useContext(Context);

    return [
      useCallback(() => dispatch(undo()), [dispatch]),
      useCallback(() => dispatch(redo()), [dispatch]),
    ];
  }

  return { UndoRedoProvider, usePresentState, useUndoRedo };
}
