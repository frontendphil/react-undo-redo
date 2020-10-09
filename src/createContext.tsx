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
  redo as redoAction,
  undo as undoAction,
} from "./createReducer";

type Dispatch<Actions> = (action: Actions) => void;

type UndoRedoContext<Present, Actions> = [
  state: UndoRedoState<Present>,
  dispatch: Dispatch<UndoRedoActions<Actions>>
];

type UndoRedoProviderProps = {
  children: ReactNode;
};

type Undo = { (): void; isPossible: boolean };
type Redo = { (): void; isPossible: boolean };

export function createContext<Present, Actions>(
  reducer: PresentReducer<Present, Actions>,
  initialState: Present
): {
  UndoRedoProvider: ComponentType<UndoRedoProviderProps>;
  usePresent: () => [Present, Dispatch<Actions>];
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

  const undoRedoReducer = createReducer(reducer);

  function UndoRedoProvider({ children }: UndoRedoProviderProps) {
    const [state, dispatch] = useReducer<
      UndoRedoReducer<Present, UndoRedoActions<Actions>>
    >(undoRedoReducer, initialUndoRedoState);

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
  }

  function usePresent(): [state: Present, dispatch: Dispatch<Actions>] {
    const [state, dispatch] = useContext(Context);

    return [state.present, dispatch];
  }

  function useUndoRedo(): [undo: Undo, redo: Redo] {
    const [state, dispatch] = useContext(Context);

    const undo = useCallback(() => dispatch(undoAction()), [dispatch]) as Undo;

    undo.isPossible = state.past.length > 0;

    const redo = useCallback(() => dispatch(redoAction()), [dispatch]) as Redo;

    redo.isPossible = state.future.length > 0;

    return [undo, redo];
  }

  return { UndoRedoProvider, usePresent, useUndoRedo };
}
