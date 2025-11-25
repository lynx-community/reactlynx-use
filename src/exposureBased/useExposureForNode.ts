import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "@lynx-js/react";
import type {
  IUseExposureForNodeOptions,
  IUseExposureForNodeReturn,
  TExposureAttrBag,
  UIAppearanceTargetDetail,
} from "./types";
import { createAdmissionGate } from "./utils";

// Node-level exposure hook with admission gating
export function useExposureForNode<
  EA extends Record<string, string | number | boolean | undefined>
>(options: IUseExposureForNodeOptions<EA>): IUseExposureForNodeReturn<EA> {
  const { attrs, onAppear, onDisappear, onChange, admissionTimeMs } = options;
  const effectiveAdmissionMs = admissionTimeMs ?? 0;
  const [isInView, setIsInView] = useState(false);

  // Keep latest callbacks to avoid re-creating gate or handlers
  const onAppearRef = useRef(onAppear);
  const onDisappearRef = useRef(onDisappear);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onAppearRef.current = onAppear;
  }, [onAppear]);
  useEffect(() => {
    onDisappearRef.current = onDisappear;
  }, [onDisappear]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Gate instance
  const gateRef = useRef(
    createAdmissionGate<UIAppearanceTargetDetail>(effectiveAdmissionMs)
  );
  useEffect(() => {
    gateRef.current.dispose();
    gateRef.current =
      createAdmissionGate<UIAppearanceTargetDetail>(effectiveAdmissionMs);
    setIsInView(false);
    return () => {
      gateRef.current.dispose();
    };
  }, [effectiveAdmissionMs]);

  const handleAppear = useCallback((detail: UIAppearanceTargetDetail) => {
    gateRef.current.appear(detail, {
      onAdmit: (ev) => {
        setIsInView(true);
        onAppearRef.current?.(ev);
        onChangeRef.current?.(ev, { isInView: true });
      },
    });
  }, []);

  const handleDisappear = useCallback((detail: UIAppearanceTargetDetail) => {
    gateRef.current.disappear(detail, {
      onLeave: (ev) => {
        setIsInView(false);
        onDisappearRef.current?.(ev);
        onChangeRef.current?.(ev, { isInView: false });
      },
    });
  }, []);

  const exposureProps = useMemo(() => {
    const baseAttrs = (attrs ?? {}) as TExposureAttrBag & EA;
    return {
      ...baseAttrs,
      binduiappear: handleAppear,
      binduidisappear: handleDisappear,
    };
  }, [attrs, handleAppear, handleDisappear]);

  return { isInView, exposureProps };
}
