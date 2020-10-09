import { createReducer, redo, undo } from "./createReducer";
import { countReducer, increment } from "./test";

describe("create reducer", () => {
  describe("init", () => {
    const presentReducer = () => null;
    const initAction = { type: "@@INIT" };

    it("should initialize the state with an empty past.", () => {
      const reducer = createReducer(presentReducer);
      const state = reducer(undefined, initAction);

      expect(state).toHaveProperty("past", []);
    });

    it("should initialize the state with an empty future.", () => {
      const reducer = createReducer(presentReducer);
      const state = reducer(undefined, initAction);

      expect(state).toHaveProperty("future", []);
    });

    it("should initialize the present state using the present reducer.", () => {
      const initialState = {};
      const presentReducer = () => initialState;

      const reducer = createReducer(presentReducer);
      const state = reducer(undefined, initAction);

      expect(state).toHaveProperty("present", initialState);
    });
  });

  describe("ready state", () => {
    it("should move the current present into the past when an action is processed.", () => {
      const reducer = createReducer(countReducer);
      const initialState = {
        past: [],
        present: 0,
        future: [],
      };

      const updatedState = reducer(initialState, increment());

      expect(updatedState).toHaveProperty("past", [0]);
      expect(updatedState).toHaveProperty("present", 1);
    });

    it("should be possible to undo an action.", () => {
      const reducer = createReducer(countReducer);
      const initialState = {
        past: [],
        present: 0,
        future: [],
      };

      const updatedState = reducer(initialState, increment());
      const revertedState = reducer(updatedState, undo());

      expect(revertedState).toHaveProperty("past", []);
      expect(revertedState).toHaveProperty("present", initialState.present);
    });

    it("should be possible to redo an action.", () => {
      const reducer = createReducer(countReducer);
      const initialState = {
        past: [],
        present: 0,
        future: [],
      };

      const updatedState = reducer(initialState, increment());
      const revertedState = reducer(updatedState, undo());
      const restoredState = reducer(revertedState, redo());

      expect(restoredState).toHaveProperty("past", [initialState.present]);
      expect(restoredState).toHaveProperty("present", updatedState.present);
    });
  });
});
