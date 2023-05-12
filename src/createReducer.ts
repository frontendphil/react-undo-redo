export type UndoRedoState<Present> = {
  past: () => Present[]
  present: () => Present
  future: () => Present[]
}

export type PresentReducer<Present, Actions> = (
  state: Present,
  action: Actions
) => Present

export type UndoRedoOptions<Actions> = {
  track?: (action: Actions) => boolean | undefined
}

export type UndoRedoReducer<Present, Actions> = (
  state: UndoRedoState<Present>,
  action: Actions
) => UndoRedoState<Present>

const enum UndoRedoActionTypes {
  UNDO = "@@react-undo-redo/undo",
  REDO = "@@react-undo-redo/redo",
}

type UndoAction = {
  type: UndoRedoActionTypes.UNDO
}

type RedoAction = {
  type: UndoRedoActionTypes.REDO
}

export type UndoRedoActions<Base> = Base | UndoAction | RedoAction

const trackAll = () => true

export function createReducer<Present, Actions extends {}>(
  presentReducer: PresentReducer<Present, Actions>,
  { track = trackAll }: UndoRedoOptions<Actions> = {}
): UndoRedoReducer<Present, UndoRedoActions<Actions>> {
  return function reducer(
    state: UndoRedoState<Present>,
    action: UndoRedoActions<Actions>
  ): UndoRedoState<Present> {
    if ("type" in action) {
      if (action.type === UndoRedoActionTypes.UNDO) {
        const [present, ...past] = state.past()
        const future = [state.present(), ...state.future()]

        return {
          past: () => past,
          present: () => present,
          future: () => future,
        }
      }

      if (action.type === UndoRedoActionTypes.REDO) {
        const past = [state.present(), ...state.past()]
        const [present, ...future] = state.future()

        return {
          past: () => past,
          present: () => present,
          future: () => future,
        }
      }
    }

    const isTrackableAction = track(action)
    if (!isTrackableAction) {
      return {
        past: () => state.past(),
        present: () => presentReducer(state.present(), action),
        future: () => state.future(),
      }
    }

    const past = [state.present(), ...state.past()]
    const present = presentReducer(state.present(), action)

    return {
      past: () => past,
      present: () => present,
      future: () => [],
    }
  }
}

export function undo(): UndoAction {
  return {
    type: UndoRedoActionTypes.UNDO,
  } as const
}

export function redo(): RedoAction {
  return {
    type: UndoRedoActionTypes.REDO,
  } as const
}
