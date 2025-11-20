# useTapLock

用于在给定方向中超过指定阈值时锁定 tap 事件的 hook。

## 示例

```tsx
import { useTapLock } from "@lynx-js/react-use";

function Demo() {
  const { tapLockRef, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTapLock();

  const handleTap = () => {
    if (tapLockRef.current) {
      console.log("Tap allowed");
    } else {
      console.log("Tap locked due to movement");
    }
  };

  return (
    <view
      main-thread:bindtouchstart={handleTouchStart}
      main-thread:bindtouchmove={handleTouchMove}
      main-thread:bindtouchend={handleTouchEnd}
      bindtap={handleTap}
    >
      Tap me
    </view>
  );
}
```

## 类型定义
```ts
import type { MainThread } from '@lynx-js/types';

type TapLockDirection = 'x' | 'y' | 'both';

interface UseTapLockOptions {
  /**
   * Movement threshold in pixels
   * @default 8
   */
  tapThreshold?: number;
  
  /**
   * Direction to monitor
   * @default 'x'
   */
  direction?: TapLockDirection;
}

function useTapLock(options?: UseTapLockOptions): {
  tapLockRef: import("@lynx-js/react").MainThreadRef<boolean>;
  handleTouchStart: (event: MainThread.TouchEvent) => void;
  handleTouchMove: (event: MainThread.TouchEvent) => boolean;
  handleTouchEnd: (event: MainThread.TouchEvent) => boolean;
};
```