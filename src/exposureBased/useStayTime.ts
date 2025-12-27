import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "@lynx-js/react";
import type {
  IUseExposureForNodeOptions,
  IUseStayTimeOptions,
  IUseStayTimeReturn,
} from "./types.js";
import { useExposureForNode } from "./useExposureForNode.js";

export function useStayTime<
  EA extends Record<string, string | number | boolean | undefined>
>(
  options: IUseStayTimeOptions<EA> = {} as IUseStayTimeOptions<EA>
): IUseStayTimeReturn<EA> {
  const { isStaying, onRunningChange, ...exposureNodeOptions } = (options ||
    {}) as IUseStayTimeOptions<EA>;
  const { isInView, exposureProps } = useExposureForNode<EA>(
    exposureNodeOptions as IUseExposureForNodeOptions<EA>
  );

  const [stayTimeMs, setStayTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const manualEnabledRef = useRef(true);
  const runningRef = useRef(false);

  const accumMsRef = useRef(0);
  const startTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onRunningChangeRef =
    useRef<IUseStayTimeOptions<EA>["onRunningChange"]>();

  useEffect(() => {
    onRunningChangeRef.current = onRunningChange;
  }, [onRunningChange]);

  const cancelRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const tick = useCallback(() => {
    if (!runningRef.current) return;
    const now = Date.now();
    const start = startTsRef.current ?? now;
    const live = accumMsRef.current + (now - start);
    setStayTimeMs(live);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startRunning = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsRunning(true);
    const now = Date.now();
    startTsRef.current = now;
    cancelRaf();
    rafRef.current = requestAnimationFrame(tick);
    const live = accumMsRef.current + (now - (startTsRef.current ?? now));
    onRunningChangeRef.current?.({ isRunning: true, stayTimeMs: live });
  }, [tick]);

  const stopRunning = useCallback(() => {
    if (!runningRef.current) return;
    const now = Date.now();
    if (startTsRef.current != null) {
      accumMsRef.current += now - startTsRef.current;
    }
    startTsRef.current = null;
    runningRef.current = false;
    setIsRunning(false);
    cancelRaf();
    const live = accumMsRef.current;
    setStayTimeMs(live);
    onRunningChangeRef.current?.({ isRunning: false, stayTimeMs: live });
  }, []);

  // React to visibility / staying change
  useEffect(() => {
    const staying = typeof isStaying === "boolean" ? isStaying : isInView;
    const shouldRun = manualEnabledRef.current && staying;
    if (shouldRun) startRunning();
    else stopRunning();
    return () => {};
  }, [isStaying, isInView, startRunning, stopRunning]);

  // Manual controls
  const pause = useCallback(() => {
    manualEnabledRef.current = false;
    stopRunning();
  }, [stopRunning]);

  const resume = useCallback(() => {
    manualEnabledRef.current = true;
    const staying = typeof isStaying === "boolean" ? isStaying : isInView;
    if (staying) startRunning();
  }, [isStaying, isInView, startRunning]);

  const reset = useCallback(() => {
    accumMsRef.current = 0;
    if (runningRef.current) {
      startTsRef.current = Date.now();
      setStayTimeMs(0);
    } else {
      startTsRef.current = null;
      setStayTimeMs(0);
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelRaf();
    };
  }, []);

  const retExposureProps = useMemo(() => {
    if (typeof isStaying === "boolean") return {} as EA;
    return exposureProps;
  }, [isStaying, exposureProps]);

  return {
    stayTimeMs,
    isRunning,
    exposureProps: retExposureProps,
    pause,
    resume,
    reset,
  };
}
