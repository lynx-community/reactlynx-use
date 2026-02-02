# useExposureForNode

节点级曝光 Hook，可选曝光准入等待。

## 示例

```tsx
import { useExposureForNode } from "@lynx-js/react-use";

export function HeroCard() {
  const { isInView, exposureProps } = useExposureForNode({
    attrs: { "exposure-id": "hero-card", "exposure-scene": "home" },
    admissionTimeMs: 100,
    onAppear: (detail) => {
      console.log("appear", detail["exposure-id"]);
    },
    onDisappear: (detail) => {
      console.log("disappear", detail["exposure-id"]);
    },
    onChange: (_detail, { isInView }) => {
      console.log("isInView", isInView);
    },
  });

  return (
    <view {...exposureProps}>
      <text>{isInView ? "可见" : "不可见"}</text>
    </view>
  );
}
```

## 类型定义

```ts
export interface IUseExposureForNodeOptions<
  EA extends Record<string, string | number | boolean | undefined>
> {
  attrs?: TExposureAttrBag & EA;
  admissionTimeMs?: number;
  onAppear?: (e: UIAppearanceTargetDetail) => void;
  onDisappear?: (e: UIAppearanceTargetDetail) => void;
  onChange?: (
    e: UIAppearanceTargetDetail,
    info: { isInView: boolean }
  ) => void;
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
```
