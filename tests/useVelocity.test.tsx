import { runOnMainThread } from '@lynx-js/react';
import { fireEvent, render } from '@lynx-js/react/testing-library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useVelocity, { type VelocityResult } from '../src/useVelocity';

describe('useVelocity', () => {
  let mockDateNow: ReturnType<typeof vi.spyOn>;
  let currentTime = 1000;

  beforeEach(() => {
    currentTime = 1000;
    mockDateNow = vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
  });

  afterEach(() => {
    mockDateNow.mockRestore();
  });

  const createTestComponent = (options = {}) => {
    let getVelocityFn: (() => VelocityResult) | null = null;

    const Comp = () => {
      const { getVelocity, handleTouchStartMT, handleTouchMoveMT } =
        useVelocity(options);
      getVelocityFn = getVelocity;

      return (
        <view
          main-thread:bindtouchstart={handleTouchStartMT}
          main-thread:bindtouchmove={handleTouchMoveMT}
        ></view>
      );
    };

    const { container } = render(<Comp />);

    const checkVelocity = runOnMainThread(() => {
      'main thread';
      return getVelocityFn?.();
    });

    return { container, checkVelocity };
  };

  describe('configuration', () => {
    it('should accept valid smoothing factors', () => {
      expect(() => createTestComponent({ smoothingFactor: 0 })).not.toThrow();
      expect(() => createTestComponent({ smoothingFactor: 0.5 })).not.toThrow();
      expect(() => createTestComponent({ smoothingFactor: 1 })).not.toThrow();
    });

    it('should reject invalid smoothing factors', () => {
      expect(() => createTestComponent({ smoothingFactor: -0.1 })).toThrow(
        /smoothingFactor must be between 0 and 1/,
      );
      expect(() => createTestComponent({ smoothingFactor: 1.1 })).toThrow(
        /smoothingFactor must be between 0 and 1/,
      );
    });
  });

  describe('velocity calculation', () => {
    it('should return velocity result with correct structure', async () => {
      const { checkVelocity } = createTestComponent();
      const result = await checkVelocity();

      expect(result).toHaveProperty('velocity');
      expect(result).toHaveProperty('direction');
      expect(typeof result?.velocity).toBe('number');
      expect(['forward', 'backward', 'none']).toContain(result?.direction);
    });

    it('should calculate positive velocity for rightward movement in LTR', async () => {
      const { container, checkVelocity } = createTestComponent({ RTL: false });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 100, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 200, y: 100 },
      });

      const result = await checkVelocity();
      expect(result?.velocity).toBeGreaterThan(0);
      expect(result?.direction).toBe('forward');
    });

    it('should calculate negative velocity for leftward movement in LTR', async () => {
      const { container, checkVelocity } = createTestComponent({ RTL: false });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 200, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 100, y: 100 },
      });

      const result = await checkVelocity();
      expect(result?.velocity).toBeLessThan(0);
      expect(result?.direction).toBe('backward');
    });
  });

  describe('RTL support', () => {
    it('should invert velocity direction in RTL mode', async () => {
      const { container, checkVelocity } = createTestComponent({ RTL: true });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 100, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 200, y: 100 },
      });

      const result = await checkVelocity();
      expect(result?.velocity).toBeLessThan(0);
      expect(result?.direction).toBe('backward');
    });
  });

  describe('gesture reset', () => {
    it('should reset velocity on new touch start', async () => {
      const { container, checkVelocity } = createTestComponent();

      // Create velocity
      fireEvent.touchstart(container.firstChild, {
        detail: { x: 100, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 200, y: 100 },
      });

      let result = await checkVelocity();
      expect(result?.velocity).not.toBe(0);

      // Reset with new touch start
      currentTime += 50;
      fireEvent.touchstart(container.firstChild, {
        detail: { x: 150, y: 100 },
      });

      result = await checkVelocity();
      expect(result?.velocity).toBe(0);
      expect(result?.direction).toBe('none');
    });

    it('should use new start position after reset', async () => {
      const { container, checkVelocity } = createTestComponent();

      // First gesture
      fireEvent.touchstart(container.firstChild, {
        detail: { x: 100, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 200, y: 100 },
      });

      // New gesture at different position
      currentTime += 50;
      fireEvent.touchstart(container.firstChild, {
        detail: { x: 500, y: 100 },
      });
      currentTime += 50;
      fireEvent.touchmove(container.firstChild, {
        detail: { x: 600, y: 100 },
      });

      const result = await checkVelocity();
      expect(result?.velocity).toBeGreaterThan(0);
      expect(Math.abs(result?.velocity || 0)).toBeLessThan(10000);
    });
  });
});
