import {
  type RenderHookResult,
  renderHook,
  waitFor,
} from '@lynx-js/react/testing-library';
import type { Mock } from 'vitest';
import { useThrottleFn } from '../../src/react-use';

describe('useThrottleFn', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should be defined', () => {
    expect(useThrottleFn).toBeDefined();
  });

  const getHook = <T>(
    initialProps: T,
    ms?: number,
  ): [Mock, RenderHookResult<T, T>] => {
    const mockFn = vi.fn((props) => props);
    return [
      mockFn,
      renderHook((props) => useThrottleFn(mockFn, ms, [props]), {
        initialProps,
      }),
    ];
  };

  it('should return the value that the given function return', () => {
    const [fn, hook] = getHook(10, 100);

    expect(hook.result.current).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should has same value if time is advanced less than the given time', () => {
    const [fn, hook] = getHook(10, 100);

    expect(hook.result.current).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);

    hook.rerender(20);
    vi.advanceTimersByTime(50);

    expect(hook.result.current).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('should update the value after the given time when arguments change', () => {
    const [fn, hook] = getHook('boo', 100);

    expect(hook.result.current).toBe('boo');
    expect(fn).toHaveBeenCalledTimes(1);

    hook.rerender('foo');
    waitFor(() => {
      expect(hook.result.current).toBe('foo');
      expect(fn).toHaveBeenCalledTimes(2);
    });
    vi.advanceTimersByTime(100);
  });

  it('should use the default ms value when missing', () => {
    const [fn, hook] = getHook('boo');

    expect(hook.result.current).toBe('boo');
    expect(fn).toHaveBeenCalledTimes(1);

    hook.rerender('foo');
    waitFor(() => {
      expect(hook.result.current).toBe('foo');
      expect(fn).toHaveBeenCalledTimes(2);
    });
    vi.advanceTimersByTime(200);
  });
  it('should not exist timer when arguments did not update after the given time', () => {
    const [fn, hook] = getHook('boo', 100);

    expect(hook.result.current).toBe('boo');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(100);

    expect(vi.getTimerCount()).toBe(0);
  });
  it('should cancel timeout on unmount', () => {
    const [fn, hook] = getHook('boo', 100);

    expect(hook.result.current).toBe('boo');
    expect(fn).toHaveBeenCalledTimes(1);

    hook.rerender('foo');
    hook.unmount();

    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
