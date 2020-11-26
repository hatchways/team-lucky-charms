import { useCallback, useRef } from 'react';

const useDebouncer = (func, delay) => {
  const ref = useRef({});
  ref.current.func = func;
  const bouncedFunc = useCallback(
    (...args) => {
      if (ref.current.timeout) {
        clearTimeout(ref.current.timeout);
      }
      ref.current.timeout = setTimeout(() => {
        ref.current.func(...args);
        ref.current.timeout = undefined;
      }, delay);
    },
    [delay],
  );
  return bouncedFunc;
};

export default useDebouncer;
