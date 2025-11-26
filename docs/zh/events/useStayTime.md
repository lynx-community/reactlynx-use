# useStayTime

用于统计元素可见时长的 Hook，支持手动控制。

## 示例

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
        <text>停留时长: {stayTimeMs}ms</text>
        <text>状态: {isRunning ? "计时中" : "已停止"}</text>
      </view>
      <button bindtap={pause}>暂停</button>
      <button bindtap={resume}>恢复</button>
      <button bindtap={reset}>重置</button>
    </view>
  );
}
```

## 类型定义

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
