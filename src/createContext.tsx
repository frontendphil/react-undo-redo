import React, {
  ComponentType,
  ReactNode,
  createContext as createReactContext,
  useContext,
  useReducer,
} from "react";

import {
  PresentReducer,
  UndoRedoReducer,
  UndoRedoState,
  createReducer,
} from "./createReducer";

type Dispatch<Actions> = (action: Actions) => void;

type UndoRedoContext<Present, Actions> = [
  state: UndoRedoState<Present>,
  dispatch: Dispatch<Actions>
];

type UndoRedoProviderProps = {
  children: ReactNode;
};

export function createContext<Present, Actions>(
  reducer: PresentReducer<Present, Actions>,
  initialState: Present
): {
  UndoRedoProvider: ComponentType<UndoRedoProviderProps>;
  usePresentState: () => Present;
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
    const [state, dispatch] = useReducer<UndoRedoReducer<Present, Actions>>(
      undoRedoReducer,
      initialUndoRedoState
    );

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
  }

  function usePresentState() {
    const [state] = useContext(Context);

    return state.present;
  }

  return { UndoRedoProvider, usePresentState };
}
