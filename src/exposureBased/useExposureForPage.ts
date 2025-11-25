import { useCallback, useEffect, useMemo, useRef } from "@lynx-js/react";
import type {
  IUseExposureForPageOptions,
  IUseExposureForPageReturn,
  TExposureAttrBag,
  UIAppearanceTargetDetail,
} from "./types";
import { createMultiAdmissionGate } from "./utils";

// Page-level exposure hook based on Lynx GlobalEventEmitter with admission gating
export function useExposureForPage<
  EA extends Record<string, string | number | boolean | undefined>
>(options: IUseExposureForPageOptions<EA>): IUseExposureForPageReturn<EA> {
  const { attrs, onAppear, onDisappear, onChange, admissionTimeMs } = options;
  const effectiveAdmissionMs = admissionTimeMs ?? 0;

  // Keep visibility state by exposure-id
  const visRef = useRef<Map<string, boolean>>(new Map());

  // Keep latest callbacks in refs
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

  // Multi-gate manager
  const gateRef = useRef(
    createMultiAdmissionGate<
      UIAppearanceTargetDetail,
      { id?: string; scene?: string }
    >(effectiveAdmissionMs)
  );
  useEffect(() => {
    gateRef.current.dispose();
    gateRef.current = createMultiAdmissionGate<
      UIAppearanceTargetDetail,
      { id?: string; scene?: string }
    >(effectiveAdmissionMs);
    return () => gateRef.current.dispose();
  }, [effectiveAdmissionMs]);

  useEffect(() => {
    // Lynx GlobalEventEmitter subscription
    const emitter = lynx?.getJSModule?.("GlobalEventEmitter");

    const handleExposure = (eventDatails: unknown) => {
      if (!Array.isArray(eventDatails)) {
        return;
      }
      for (const item of eventDatails as UIAppearanceTargetDetail[]) {
        const exposureId: string | undefined = item["exposure-id"];
        const exposureScene: string | undefined = item["exposure-scene"];
        gateRef.current.appear(
          item,
          { id: exposureId, scene: exposureScene },
          {
            onAdmit: (ev, info) => {
              if (info.id) visRef.current.set(info.id, true);
              onAppearRef.current?.(ev, {
                exposureId: info.id,
                exposureScene: info.scene,
              });
              onChangeRef.current?.(ev, {
                isInView: true,
                exposureId: info.id,
                exposureScene: info.scene,
              });
            },
          }
        );
      }
    };

    const handleDisExposure = (eventDatails: unknown) => {
      if (!Array.isArray(eventDatails)) {
        return;
      }
      for (const item of eventDatails as UIAppearanceTargetDetail[]) {
        const exposureId: string | undefined = item["exposure-id"];
        const exposureScene: string | undefined = item["exposure-scene"];
        gateRef.current.disappear(
          item,
          { id: exposureId, scene: exposureScene },
          {
            onLeave: (ev, info) => {
              if (info.id) visRef.current.set(info.id, false);
              onDisappearRef.current?.(ev, {
                exposureId: info.id,
                exposureScene: info.scene,
              });
              onChangeRef.current?.(ev, {
                isInView: false,
                exposureId: info.id,
                exposureScene: info.scene,
              });
            },
          }
        );
      }
    };

    emitter?.addListener?.("exposure", handleExposure);
    emitter?.addListener?.("disexposure", handleDisExposure);

    return () => {
      emitter?.removeListener?.("exposure", handleExposure);
      emitter?.removeListener?.("disexposure", handleDisExposure);
    };
  }, []);

  // Visibility query by id
  const isInView = useCallback((exposureId: string) => {
    return visRef.current.get(exposureId) === true;
  }, []);

  // Factory to produce per-item exposure attributes
  const exposureProps = useMemo(() => {
    return (p: { id: string; extra?: EA }): TExposureAttrBag & EA => {
      const base = (attrs ?? {}) as Omit<TExposureAttrBag, "exposure-id"> & EA;
      return {
        ...base,
        ...(p.extra ?? ({} as EA)),
        "exposure-id": p.id,
      };
    };
  }, [attrs]);

  return { isInView, exposureProps };
}
