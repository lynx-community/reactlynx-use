// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { useMainThreadRef } from '@lynx-js/react';
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

const DEFAULT_SMOOTHING_FACTOR = 0.2;
const DEFAULT_MAX_TIME_DELTA = 100;

export default function useVelocity(
  options?: UseVelocityOptions,
): UseVelocityReturn {
  const {
    RTL = false,
    smoothingFactor = DEFAULT_SMOOTHING_FACTOR,
    maxTimeDelta = DEFAULT_MAX_TIME_DELTA,
  } = options || {};

  // Validate smoothing factor is between 0 and 1
  if (smoothingFactor < 0 || smoothingFactor > 1) {
    throw new Error(
      `smoothingFactor must be between 0 and 1, got ${smoothingFactor}`,
    );
  }

  // State management using main thread refs
  const previousPositionRef = useMainThreadRef<number | null>(null);
  const previousTimestampRef = useMainThreadRef<number | null>(null);
  const currentVelocityRef = useMainThreadRef<number>(0);

  const getVelocity = (): VelocityResult => {
    'main thread';
    const velocity = currentVelocityRef.current;

    let direction: Direction = 'none';
    if (velocity > 0) {
      direction = 'forward';
    } else if (velocity < 0) {
      direction = 'backward';
    }

    return { velocity, direction };
  };

  const handleTouchStartMT = (event: MainThread.TouchEvent) => {
    'main thread';
    // Reset state
    currentVelocityRef.current = 0;
    previousPositionRef.current = null;
    previousTimestampRef.current = null;

    // Initialize with starting position
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const position = event.detail.x as number;
    previousPositionRef.current = position;
    previousTimestampRef.current = Date.now();
  };

  const handleTouchMoveMT = (event: MainThread.TouchEvent) => {
    'main thread';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentPosition = event.detail.x as number;
    const currentTimestamp = Date.now();

    // Check if we have previous state
    if (
      previousPositionRef.current === null ||
      previousTimestampRef.current === null
    ) {
      return;
    }

    // Calculate time delta in seconds
    const timeDeltaMs = currentTimestamp - previousTimestampRef.current;
    const timeDeltaSec = timeDeltaMs / 1000;

    // Handle zero or negative time delta
    if (timeDeltaSec <= 0) {
      return;
    }

    // Calculate position delta considering RTL mode
    const positionDelta = RTL
      ? previousPositionRef.current - currentPosition
      : currentPosition - previousPositionRef.current;

    // Calculate instantaneous velocity (pixels per second)
    const instantaneousVelocity = positionDelta / timeDeltaSec;

    // Handle large time delta by resetting smoothing
    if (timeDeltaMs > maxTimeDelta) {
      // Don't apply smoothing, just use instantaneous velocity
      currentVelocityRef.current = instantaneousVelocity;
    } else {
      // Apply weighted moving average
      currentVelocityRef.current =
        smoothingFactor * instantaneousVelocity +
        (1 - smoothingFactor) * currentVelocityRef.current;
    }

    // Update previous state for next calculation
    previousPositionRef.current = currentPosition;
    previousTimestampRef.current = currentTimestamp;
  };

  return {
    getVelocity,
    handleTouchStartMT,
    handleTouchMoveMT,
  };
}
