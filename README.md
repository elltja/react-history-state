# React history state

React history state is an extension of reacts built in useState. As the name says, it's used for managing history of a state in react. 

## Usage example

```js

import { useHistoryState } from 'react-history-state'

export default function App() {
    const [text, setText, undo, redo] = useHistoryState('');

    return (
        <input 
            value={text}
            onChange={(e) => setText(e.target.value)} 
        />
        <button onClick={undo}>Undo<button>
        <button onClick={redo}>Redo<button>
    )

}

```