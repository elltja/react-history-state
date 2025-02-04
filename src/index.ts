import { useState } from "react";

export function useHistoryState<T>(
  initialState: T
): [
  T,
  (setter: T | ((prevState: T) => T)) => void,
  () => void,
  () => void,
  () => void
] {
  const [_state, _setState] = useState<T>(initialState);
  const [_history, _setHistory] = useState<T[]>([initialState]);
  const [_historyIndex, _setHistoryIndex] = useState<number>(0);

  function setState(setter: T | ((prevState: T) => T)): void {
    const newVal =
      typeof setter === "function"
        ? (setter as (prevState: T) => T)(_state)
        : setter;
    _setHistory((prevHistory) => {
      const newHistory: T[] = [
        ...prevHistory.slice(0, _historyIndex + 1),
        newVal,
      ];
      return newHistory;
    });
    _setHistoryIndex((prevIndex) => prevIndex + 1);
    _setState(newVal);
  }

  function undo(): void {
    _setHistoryIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        _setState(_history[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }

  function redo(): void {
    _setHistoryIndex((prevIndex) => {
      if (prevIndex < _history.length - 1) {
        const newIndex = prevIndex + 1;
        _setState(_history[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }

  function clear(): void {
    _setHistory([initialState]);
    _setHistoryIndex(0);
  }

  return [_state, setState, undo, redo, clear];
}
