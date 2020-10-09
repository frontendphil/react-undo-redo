import { useReducer } from "react";

import {
  PresentReducer,
  UndoRedoReducer,
  UndoRedoState,
  createReducer,
} from "./createReducer";

export function useUndoRedo<Present, Actions>(
  reducer: PresentReducer<Present, Actions>,
  initialState: Present
): [Present] {
  const [state] = useReducer<UndoRedoReducer<Present, Actions>>(
    createReducer(reducer, initialState),
    {
      past: [],
      present: initialState,
      future: [],
    }
  );

  return [state.present];
}
