import { useMainThreadRef } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

const TAP_THRESHOLD = 8;

type TapLockDirection = 'x' | 'y' | 'both';

interface UseTapLockOptions {
  tapThreshold?: number;
  direction?: TapLockDirection;
}

function useTapLock(options: UseTapLockOptions = {}) {
  const { tapThreshold = TAP_THRESHOLD, direction = 'x' } = options;

  const tapLockRef = useMainThreadRef<boolean>(true);
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartYRef = useMainThreadRef<number>(0);

  function handleTouchStart(event: MainThread.TouchEvent) {
    'main thread';
    tapLockRef.current = true;
    touchStartXRef.current = event.detail.x;
    touchStartYRef.current = event.detail.y;
  }

  function checkThreshold(event: MainThread.TouchEvent): boolean {
    'main thread';
    const deltaX = event.detail.x - touchStartXRef.current;
    const deltaY = event.detail.y - touchStartYRef.current;

    let shouldUnlock = false;

    if (direction === 'x') {
      shouldUnlock = Math.abs(deltaX) > tapThreshold;
    } else if (direction === 'y') {
      shouldUnlock = Math.abs(deltaY) > tapThreshold;
    } else if (direction === 'both') {
      shouldUnlock = Math.abs(deltaX) > tapThreshold
        || Math.abs(deltaY) > tapThreshold;
    }

    if (shouldUnlock) {
      tapLockRef.current = false;
    }
    return tapLockRef.current;
  }

  function handleTouchMove(event: MainThread.TouchEvent) {
    'main thread';
    return checkThreshold(event);
  }

  function handleTouchEnd(event: MainThread.TouchEvent) {
    'main thread';
    return checkThreshold(event);
  }

  return {
    tapLockRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

export default useTapLock;
export type { UseTapLockOptions, TapLockDirection };
