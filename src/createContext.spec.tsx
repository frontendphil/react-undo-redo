import React from "react";

import { render } from "@testing-library/react";

import { createContext } from "./createContext";
import { countReducer } from "./test";

describe("createContext", () => {
  it("should provide access to the present state.", () => {
    const { UndoRedoProvider, usePresentState } = createContext(
      countReducer,
      0
    );
    const Component = () => {
      const state = usePresentState();

      return <div>{state}</div>;
    };

    const { queryByText } = render(
      <UndoRedoProvider>
        <Component />
      </UndoRedoProvider>
    );

    expect(queryByText("0")).toBeInTheDocument();
  });

  it.todo("should be possible to undo an update.");
  it.todo("should be possible to redo an update.");
});
