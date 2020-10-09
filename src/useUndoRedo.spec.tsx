import React from "react";

import { render } from "@testing-library/react";

import { countReducer } from "./test";
import { useUndoRedo } from "./useUndoRedo";

describe("useUndoRedo", () => {
  it("should provide access to the present state.", () => {
    const Component = () => {
      const [state] = useUndoRedo(countReducer, 0);

      return <div>{state}</div>;
    };

    const { queryByText } = render(<Component />);

    expect(queryByText("0")).toBeInTheDocument();
  });

  it.todo("should be possible to undo an update.");
  it.todo("should be possible to redo an update.");
});
