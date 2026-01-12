import { useRef } from '@lynx-js/react';
import useEffectOnce from './useEffectOnce.js';

const useUnmount = (fn: () => void): void => {
  const fnRef = useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
