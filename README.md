# react-undo-redo

A utility to add undo and redo functionality to any state managed through a reducer.
This library **does not** require [`redux`](https://redux.js.org/).
If you're looking for something that adds undo and redo to a state that is managed through `redux` you might be in the wrong place.

## Installation

Through [`yarn`](https://yarnpkg.com/).

```sh
yarn add react-undo-redo
```

Through [`npm`](https://www.npmjs.com/)

```sh
npm install --save react-undo-redo
```

## Usage

```js
import React from "react";
import { createUndoRedo } from "react-undo-redo";

import { yourReducer } from "./yourReducer";

const { UndoRedoProvider, usePresent, useUndoRedo } = createUndoRedo(
  yourReducer,
  initialState
);

function Application() {
  return <UndoRedoProvider>{/* Your application code */}</UndoRedoProvider>;
}

function Menu() {
  const [undo, redo] = useUndoRedo();

  return (
    <>
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>
    </>
  );
}
```
