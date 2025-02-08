import { useRef, useState } from "react";

type Options = {
  throttle?: number;
  commitEvery?: number;
};

export function useHistoryState<T>(
  initialState: T,
  options: Options = {}
): [
  T,
  (setter: T | ((prevState: T) => T)) => void,
  () => void,
  () => void,
  () => void
] {
  const { throttle = 0, commitEvery = 1 } = options;
  const [_state, _setState] = useState<T>(initialState);
  const [_history, _setHistory] = useState<T[]>([initialState]);
  const [_historyIndex, _setHistoryIndex] = useState<number>(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestStateRef = useRef<T>(initialState);
  const changeCounter = useRef(0);

  function updateHistory(newVal: T) {
    _setHistory((prevHistory) => {
      const newHistory: T[] = [
        ...prevHistory.slice(0, _historyIndex + 1),
        newVal,
      ];
      return newHistory;
    });
    _setHistoryIndex((prevIndex) => prevIndex + 1);
    changeCounter.current = 0;
  }

  function setState(setter: T | ((prevState: T) => T)): void {
    const newVal =
      typeof setter === "function"
        ? (setter as (prevState: T) => T)(_state)
        : setter;

    latestStateRef.current = newVal;
    _setState(newVal);

    changeCounter.current += 1;

    if (throttle > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateHistory(latestStateRef.current);
      }, throttle);
    } else {
      if (changeCounter.current >= commitEvery) updateHistory(newVal);
    }
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
