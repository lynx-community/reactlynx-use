# useVelocity

A hook that tracks touch velocity and direction with smoothing support.

## Usage

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
      onTouchStart={handleTouchStartMT}
      onTouchMove={handleTouchMoveMT}
      onTouchEnd={() => {
        const { velocity, direction } = getVelocity();
        console.log(`Velocity: ${velocity}px/s, Direction: ${direction}`);
      }}
    >
      <text>Swipe me!</text>
    </view>
  );
};
```

## Type Declarations

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
