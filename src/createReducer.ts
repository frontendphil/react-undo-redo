import invariant from "tiny-invariant";

export type UndoRedoState<Present> = {
  past: Present[];
  present: Present;
  future: Present[];
};

export type PresentReducer<Present, Actions> = (
  state: void | Present,
  action: Actions
) => Present;

export type UndoRedoReducer<Present, Actions> = (
  state: void | UndoRedoState<Present>,
  action: Actions
) => UndoRedoState<Present>;

enum UndoRedoActionTypes {
  UNDO = "@@react-undo-redo/undo",
  REDO = "@@react-undo-redo/redo",
}

type UndoAction = {
  type: UndoRedoActionTypes.UNDO;
};

type RedoAction = {
  type: UndoRedoActionTypes.REDO;
};

export type UndoRedoActions<Base> = Base | UndoAction | RedoAction;

export function createReducer<Present, Actions>(
  presentReducer: PresentReducer<Present, Actions>,
  initialState?: Present
): UndoRedoReducer<Present, UndoRedoActions<Actions>> {
  return function reducer(
    state: void | UndoRedoState<Present>,
    action: UndoRedoActions<Actions>
  ): UndoRedoState<Present> {
    if (
      "type" in action &&
      (action.type === UndoRedoActionTypes.UNDO ||
        action.type === UndoRedoActionTypes.REDO)
    ) {
      invariant(state, "Undo-redo state must have been initialized");

      if (action.type === UndoRedoActionTypes.UNDO) {
        const [present, ...past] = state.past;

        return {
          past,
          present,
          future: [state.present, ...state.future],
        };
      }

      if (action.type === UndoRedoActionTypes.REDO) {
        const [present, ...future] = state.future;

        return {
          past: [state.present, ...state.past],
          present,
          future,
        };
      }

      return state;
    }

    if (!state) {
      return {
        past: [],
        present: presentReducer(initialState, action),
        future: [],
      };
    }

    return {
      past: [state.present, ...state.past],
      present: presentReducer(state.present, action),
      future: [],
    };
  };
}

export function undo(): UndoAction {
  return {
    type: UndoRedoActionTypes.UNDO,
  } as const;
}

export function redo(): RedoAction {
  return {
    type: UndoRedoActionTypes.REDO,
  } as const;
}
