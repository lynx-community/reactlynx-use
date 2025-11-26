import type { Target, UIAppearanceDetailEvent } from "@lynx-js/types";

export type UIAppearanceTargetDetail =
  UIAppearanceDetailEvent<Target>["detail"];

// Exposure attributes supported by Lynx
export type TExposureAttrBag = {
  "exposure-id"?: string;
  "exposure-scene"?: string;
  "exposure-area"?: `${number}%`;
  "exposure-screen-margin-top"?: `${number}px` | `${number}rpx`;
  "exposure-screen-margin-right"?: `${number}px` | `${number}rpx`;
  "exposure-screen-margin-bottom"?: `${number}px` | `${number}rpx`;
  "exposure-screen-margin-left"?: `${number}px` | `${number}rpx`;
  "enable-exposure-ui-margin"?: boolean;
  "exposure-ui-margin-top"?: `${number}px` | `${number}rpx`;
  "exposure-ui-margin-right"?: `${number}px` | `${number}rpx`;
  "exposure-ui-margin-bottom"?: `${number}px` | `${number}rpx`;
  "exposure-ui-margin-left"?: `${number}px` | `${number}rpx`;
  "enable-exposure-ui-clip"?: boolean;
};

export interface IUseExposureForNodeOptions<
  EA extends Record<string, string | number | boolean | undefined>
> {
  attrs?: TExposureAttrBag & EA;
  admissionTimeMs?: number;
  onAppear?: (e: UIAppearanceTargetDetail) => void;
  onDisappear?: (e: UIAppearanceTargetDetail) => void;
  onChange?: (e: UIAppearanceTargetDetail, info: { isInView: boolean }) => void;
}

export interface IUseExposureForNodeReturn<
  EA extends Record<string, string | number | boolean | undefined>
> {
  isInView: boolean;
  exposureProps: {
    binduiappear?: (e: UIAppearanceTargetDetail) => void;
    binduidisappear?: (e: UIAppearanceTargetDetail) => void;
  } & TExposureAttrBag &
    EA;
}

export interface IUseExposureForPageOptions<
  EA extends Record<string, string | number | boolean | undefined>
> {
  // Shared attrs for all items (do not include exposure-id / exposure-scene here)
  // Scene should be specified when creating the hook (shared),
  // so allow exposure-scene in shared attrs; only exclude exposure-id.
  attrs?: Omit<TExposureAttrBag, "exposure-id"> & EA;
  // Minimum exposure duration (ms) required to admit an item exposure.
  /** @deprecated Use admissionTimeMs */
  admissionMs?: number;
  admissionTimeMs?: number;
  onAppear?: (
    e: UIAppearanceTargetDetail,
    info: { exposureId?: string; exposureScene?: string }
  ) => void;
  onDisappear?: (
    e: UIAppearanceTargetDetail,
    info: { exposureId?: string; exposureScene?: string }
  ) => void;
  onChange?: (
    e: UIAppearanceTargetDetail,
    info: { isInView: boolean; exposureId?: string; exposureScene?: string }
  ) => void;
}

export interface IUseExposureForPageReturn<
  EA extends Record<string, string | number | boolean | undefined>
> {
  // Query current visibility by exposure-id
  isInView: (exposureId: string) => boolean;
  // Build per-item exposure props by passing id / scene (plus optional extra attrs)
  exposureProps: (p: { id: string; extra?: EA }) => TExposureAttrBag & EA;
}

// Stay time hook types
export interface IUseStayTimeOptions<
  EA extends Record<string, string | number | boolean | undefined>
> extends IUseExposureForNodeOptions<EA> {
  // When provided, timer runs purely by this flag
  // and ignores exposure visibility; exposureProps will be {}.
  isStaying?: boolean;
  // Callback when running state changes (start/pause)
  onRunningChange?: (info: { isRunning: boolean; stayTimeMs: number }) => void;
}

export interface IUseStayTimeReturn<
  EA extends Record<string, string | number | boolean | undefined>
> {
  // Accumulated stay time in milliseconds
  stayTimeMs: number;
  // Whether timer is actively running (manual enable && staying condition)
  isRunning: boolean;
  // Props to spread on the target element
  exposureProps:
    | {
        binduiappear?: (e: UIAppearanceTargetDetail) => void;
        binduidisappear?: (e: UIAppearanceTargetDetail) => void;
      } & TExposureAttrBag &
        EA;
  // Manual controls
  pause: () => void;
  resume: () => void;
  reset: () => void;
}
