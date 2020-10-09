import React from "react";

import { fireEvent, render } from "@testing-library/react";

import { createContext } from "./createContext";
import { countReducer, increment } from "./test";

describe("createContext", () => {
  it("should provide access to the present state.", () => {
    const { UndoRedoProvider, usePresentState } = createContext(
      countReducer,
      0
    );
    const Component = () => {
      const [state] = usePresentState();

      return <div>{state}</div>;
    };

    const { queryByText } = render(
      <UndoRedoProvider>
        <Component />
      </UndoRedoProvider>
    );

    expect(queryByText("0")).toBeInTheDocument();
  });

  it("should be possible to undo an update.", () => {
    const { UndoRedoProvider, usePresentState, useUndo } = createContext(
      countReducer,
      0
    );

    const Component = () => {
      const [state, dispatch] = usePresentState();
      const undo = useUndo();

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
        </div>
      );
    };

    const { queryByText, getByText } = render(
      <UndoRedoProvider>
        <Component />
      </UndoRedoProvider>
    );

    fireEvent.click(getByText("Increment"));

    expect(queryByText("1")).toBeInTheDocument();

    fireEvent.click(getByText("Undo"));

    expect(queryByText("0")).toBeInTheDocument();
  });

  it("should be possible to redo an update.", () => {
    const {
      UndoRedoProvider,
      usePresentState,
      useUndo,
      useRedo,
    } = createContext(countReducer, 0);

    const Component = () => {
      const [state, dispatch] = usePresentState();
      const undo = useUndo();
      const redo = useRedo();

      return (
        <div>
          {state}

          <button onClick={() => dispatch(increment())}>Increment</button>

          <button onClick={() => undo()}>Undo</button>
          <button onClick={() => redo()}>Redo</button>
        </div>
      );
    };

    const { queryByText, getByText } = render(
      <UndoRedoProvider>
        <Component />
      </UndoRedoProvider>
    );

    fireEvent.click(getByText("Increment"));
    fireEvent.click(getByText("Undo"));
    fireEvent.click(getByText("Redo"));

    expect(queryByText("1")).toBeInTheDocument();
  });
});
