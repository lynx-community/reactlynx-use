import { useEffect, useState } from '@lynx-js/react';
import type { ObserveCallback, ObserveCallbackResult } from '@lynx-js/types';

export type IntersectionObserverOptions = {
  thresholds?: [];
  initialRatio?: number;
  observeAll?: boolean;
};

// For main-thread components IntersectionObserver implementation
const useIntersection = (
  seletor: string,
  options: IntersectionObserverOptions,
): ObserveCallbackResult | null => {
  'background only';

  const [
    intersectionObserveCallbackResult,
    setIntersectionObserveCallbackResult,
  ] = useState<ObserveCallbackResult | null>(null);

  useEffect(() => {
    if (typeof lynx?.createIntersectionObserver === 'function') {
      const handler: ObserveCallback = (result: ObserveCallbackResult) => {
        setIntersectionObserveCallbackResult(result);
      };

      const observer = lynx.createIntersectionObserver(
        { componentId: '' },
        options,
      );
      observer.observe(seletor, handler);

      return () => {
        setIntersectionObserveCallbackResult(null);
        observer.disconnect();
      };
    }
    return () => {};
  }, [seletor, options.thresholds, options.initialRatio, options.observeAll]);

  return intersectionObserveCallbackResult;
};

export default useIntersection;
