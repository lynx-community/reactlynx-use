# useExposureForNode

Node-level exposure hook with optional admission gating.

## Usage

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
      <text>{isInView ? "Visible" : "Hidden"}</text>
    </view>
  );
}
```

## Type Declarations

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
