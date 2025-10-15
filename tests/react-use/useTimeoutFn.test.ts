import {
  act,
  type RenderHookResult,
  renderHook,
} from '@lynx-js/react/testing-library';
import type { Mock } from 'vitest';
import type { UseTimeoutFnReturn } from '../../src';
import { useTimeoutFn } from '../../src';

describe('useTimeoutFn', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(useTimeoutFn).toBeDefined();
  });

  it('should return three functions', () => {
    const hook = renderHook(() => useTimeoutFn(() => {}, 5));

    expect(hook.result.current.length).toBe(3);
    expect(typeof hook.result.current[0]).toBe('function');
    expect(typeof hook.result.current[1]).toBe('function');
    expect(typeof hook.result.current[2]).toBe('function');
  });

  function getHook(
    ms: number = 5,
    fn: Mock = vi.fn(),
  ): [
    Mock,
    RenderHookResult<UseTimeoutFnReturn, { delay: number; cb: Mock }>,
  ] {
    return [
      fn,
      renderHook(({ delay = 5, cb }) => useTimeoutFn(cb, delay), {
        initialProps: { delay: ms, cb: fn },
      }),
    ];
  }

  it('should call passed function after given amount of time', () => {
    const [spy] = getHook();

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should cancel function call on unmount', () => {
    const [spy, hook] = getHook();

    expect(spy).not.toHaveBeenCalled();
    hook.unmount();
    vi.advanceTimersByTime(5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('first function should return actual state of timeout', () => {
    let [, hook] = getHook();
    let [isReady] = hook.result.current;

    expect(isReady()).toBe(false);
    hook.unmount();
    expect(isReady()).toBe(null);

    [, hook] = getHook();
    [isReady] = hook.result.current;
    vi.advanceTimersByTime(5);
    expect(isReady()).toBe(true);
  });

  it('second function should cancel timeout', () => {
    const [spy, hook] = getHook();
    const [isReady, cancel] = hook.result.current;

    expect(spy).not.toHaveBeenCalled();
    expect(isReady()).toBe(false);

    act(() => {
      cancel();
    });
    vi.advanceTimersByTime(5);

    expect(spy).not.toHaveBeenCalled();
    expect(isReady()).toBe(null);
  });

  it('third function should reset timeout', () => {
    const [spy, hook] = getHook();
    const [isReady, cancel, reset] = hook.result.current;

    expect(isReady()).toBe(false);

    act(() => {
      cancel();
    });
    vi.advanceTimersByTime(5);

    expect(isReady()).toBe(null);

    act(() => {
      reset();
    });
    expect(isReady()).toBe(false);

    vi.advanceTimersByTime(5);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(isReady()).toBe(true);
  });

  it('should reset timeout on delay change', () => {
    const [spy, hook] = getHook(50);

    expect(spy).not.toHaveBeenCalled();
    hook.rerender({ delay: 5, cb: spy });

    vi.advanceTimersByTime(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should NOT reset timeout on function change', () => {
    const [spy, hook] = getHook(50);

    vi.advanceTimersByTime(25);
    expect(spy).not.toHaveBeenCalled();

    const spy2 = vi.fn();
    hook.rerender({ delay: 50, cb: spy2 });

    vi.advanceTimersByTime(25);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});
