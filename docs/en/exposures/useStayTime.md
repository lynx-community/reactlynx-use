# useStayTime

Track how long an element stays visible, with optional manual control.

## Usage

```tsx
import { useStayTime } from "@lynx-js/react-use";

export function StayTimer() {
  const {
    stayTimeMs,
    isRunning,
    exposureProps,
    pause,
    resume,
    reset,
  } = useStayTime({
    admissionTimeMs: 60,
    onRunningChange: ({ isRunning, stayTimeMs }) => {
      console.log("running?", isRunning, "ms:", stayTimeMs);
    },
  });

  return (
    <view>
      <view {...exposureProps}>
        <text>Stay time: {stayTimeMs}ms</text>
        <text>Status: {isRunning ? "running" : "stopped"}</text>
      </view>
      <button bindtap={pause}>Pause</button>
      <button bindtap={resume}>Resume</button>
      <button bindtap={reset}>Reset</button>
    </view>
  );
}
```

## Type Declarations

```ts
export interface IUseStayTimeOptions<
  EA extends Record<string, string | number | boolean | undefined>
> extends IUseExposureForNodeOptions<EA> {
  isStaying?: boolean;
  onRunningChange?: (info: { isRunning: boolean; stayTimeMs: number }) => void;
}

export interface IUseStayTimeReturn<
  EA extends Record<string, string | number | boolean | undefined>
> {
  stayTimeMs: number;
  isRunning: boolean;
  exposureProps:
    | {
        binduiappear?: (e: UIAppearanceTargetDetail) => void;
        binduidisappear?: (e: UIAppearanceTargetDetail) => void;
      } & TExposureAttrBag &
        EA;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}
```
