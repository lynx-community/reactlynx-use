# useVelocity

用于跟踪 tap 速度和方向的 hook。

## 示例

```tsx
import { useVelocity } from "@lynx-js/react-use";

const Demo = () => {
  const { getVelocity, handleTouchStartMT, handleTouchMoveMT } = useVelocity({
    smoothingFactor: 0.2,
    maxTimeDelta: 100,
    RTL: false,
  });

  return (
    <view
      main-thread:bindtouchstart={handleTouchStartMT}
      main-thread:bindtouchmovee={handleTouchMoveMT}
      main-thread:bindtouchend={() => {
        "main thread";
        const { velocity, direction } = getVelocity();
        console.log(`Velocity: ${velocity}px/s, Direction: ${direction}`);
      }}
    >
      <text>Swipe me!</text>
    </view>
  );
};
```

## 类型定义

```ts
import type { MainThread } from '@lynx-js/types';
export type Direction = 'forward' | 'backward' | 'none';
export interface UseVelocityOptions {
    RTL?: boolean;
    smoothingFactor?: number;
    maxTimeDelta?: number;
}
export interface VelocityResult {
    velocity: number;
    direction: Direction;
}
export interface UseVelocityReturn {
    getVelocity: () => VelocityResult;
    handleTouchStartMT: (event: MainThread.TouchEvent) => void;
    handleTouchMoveMT: (event: MainThread.TouchEvent) => void;
}
export default function useVelocity(options?: UseVelocityOptions): UseVelocityReturn;
```
