# useExposureForPage

页面级曝光 Hook，监听 `GlobalEventEmitter` 的曝光/反曝光事件并支持准入等待。

## 示例

```tsx
import { useExposureForPage } from "@lynx-js/react-use";

const items = [
  { id: "card-1", title: "A" },
  { id: "card-2", title: "B" },
];

export function Feed() {
  const { isInView, exposureProps } = useExposureForPage({
    attrs: { "exposure-scene": "feed" },
    admissionTimeMs: 80,
    onAppear: (_detail, info) => console.log("appear", info.exposureId),
    onDisappear: (_detail, info) => console.log("disappear", info.exposureId),
  });

  return (
    <view>
      {items.map((item) => (
        <view key={item.id} {...exposureProps({ id: item.id })}>
          <text>
            {item.title} {isInView(item.id) ? "(可见)" : "(不可见)"}
          </text>
        </view>
      ))}
    </view>
  );
}
```

## 类型定义

```ts
export interface IUseExposureForPageOptions<
  EA extends Record<string, string | number | boolean | undefined>
> {
  attrs?: Omit<TExposureAttrBag, "exposure-id"> & EA;
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
  isInView: (exposureId: string) => boolean;
  exposureProps: (p: { id: string; extra?: EA }) => TExposureAttrBag & EA;
}
```
