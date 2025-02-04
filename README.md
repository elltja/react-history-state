# React history state

React History State is an extension of React's built-in useState hook. As the name suggests, it helps manage state history in React, allowing you to easily undo and redo state changes

## Features

- Simple state management with useState-like API
- Undo and redo functionality
- Clear history support
- TypeScript support with full type safety

## Installation
Install using npm:

```bash

npm install react-history-state

```

## Usage example

```js

import { useHistoryState } from 'react-history-state'

export default function App() {
    const [text, setText, undo, redo] = useHistoryState('');

    return (
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)} 
        />
        <button onClick={undo}>Undo<button>
        <button onClick={redo}>Redo<button>
    )

}

```

## License

MIT
