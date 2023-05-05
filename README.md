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

In order to create the provider and hooks to manage undo and redo you call `createUndoRedo` and pass the `reducer` you'd like to enhance.
This method returns a provider component and hooks to work with your state.
The `reducer` you pass does not need any knowledge about this feature.

```js
import { createUndoRedo } from "react-undo-redo"

const { UndoRedoProvider, usePast, usePresent, useFuture, useUndoRedo } =
  createUndoRedo(reducer)
```

`createUndoRedo` also accepts an options object as a second parameter. Currently available options:

- `track` - function with signature `(action) => boolean`. It is invoked on every dispatch and defines whether the new state is avaiable for undo/redo. If function returns `false`, the state won't affect the change history. It is useful in situations, when the change is not reflected in the UI or the user cannot control over.

```js
import { createUndoRedo } from "react-undo-redo"

const { UndoRedoProvider, usePast, usePresent, useFuture, useUndoRedo } =
  createUndoRedo(reducer, {track: (action) => action.type !== 'GET_NEW_TODOS'})
```


### `UndoRedoProvider`

| Prop           | Required | Description                                                                                               |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `initialState` | ✔️       | The initial state that your reducer needs. This does **not** need any notion of past, present, or future. |
| `past`         |          | If you like to restore a prior session you can pass an earlier version of past states here.               |
| `future`       |          | If you like to restore a prior session you can pass an earlier version of future states here.             |

```js
function Component() {
  return (
    <UndoRedoProvider initialState={0}>
      <Counter />
    </UndoRedoProvider>
  )
}
```

### `usePresent` => `[state, dispatch]`

The return value of this hook mimics the [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) hook.
You get access to the current present state.
Use the `dispatch` method to dispatch any of your actions.

```js
function Component() {
  const [count, dispatch] = usePresent()

  return (
    <>
      <div>count: {count}</div>

      <button onClick={() => dispatch({ type: "increment" })}>Add 1</button>
    </>
  )
}
```

### `useUndoRedo` => `[undo, redo]`

Returns a tuple that contains methods to signal `undo` or `redo`.
If you call the two methods `react-undo-redo` updates the current `present` state.

**Important**: You can also call `undo` or `redo` when there is nothing to undo or redo.
However, you can check whether there is anything to undo or redo by checking the `isPossible` prop that is present on both methods.

```js
function Component() {
  const [undo, redo] = useUndoRedo()

  return (
    <>
      <button disabled={!undo.isPossible} onClick={() => undo()}>
        Undo
      </button>

      <button disabled={!redo.isPossible} onClick={() => redo()}>
        Redo
      </button>
    </>
  )
}
```

### `usePast` => `[...state]`

Returns all current past states (i.e. state snapshots when actions are dispatched).
You probably don't need to use this.

### `useFuture` => `[...state]`

Returns all current future states (i.e. states that have been undone).
You probably don't need to use this.
