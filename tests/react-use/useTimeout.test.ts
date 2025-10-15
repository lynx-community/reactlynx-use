import {
  act,
  type RenderHookResult,
  renderHook,
  waitFor,
} from '@lynx-js/react/testing-library';
import type { Mock } from 'vitest';
import type { UseTimeoutReturn } from '../../src/useTimeout';
import useTimeout from '../../src/useTimeout';

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
  expect(useTimeout).toBeDefined();
});

it('should return three functions', () => {
  const hook = renderHook(() => useTimeout(5));

  expect(hook.result.current.length).toBe(3);
  expect(typeof hook.result.current[0]).toBe('function');
  expect(typeof hook.result.current[1]).toBe('function');
  expect(typeof hook.result.current[2]).toBe('function');
});

function getHook(
  ms: number = 5,
): [Mock, RenderHookResult<UseTimeoutReturn, { delay: number }>] {
  const spy = vi.fn();
  return [
    spy,
    renderHook(
      ({ delay = 5 }) => {
        spy();
        return useTimeout(delay);
      },
      { initialProps: { delay: ms } },
    ),
  ];
}

it('should re-render component after given amount of time', () => {
  const [spy, _] = getHook();
  expect(spy).toHaveBeenCalledTimes(1);
  waitFor(() => {
    expect(spy).toHaveBeenCalledTimes(2);
  });
  vi.advanceTimersByTime(5);
});

it('should cancel timeout on unmount', () => {
  const [spy, hook] = getHook();

  expect(spy).toHaveBeenCalledTimes(1);
  hook.unmount();
  vi.advanceTimersByTime(5);
  expect(spy).toHaveBeenCalledTimes(1);
});

it('first function should return actual state of timeout', () => {
  let [, hook] = getHook();
  let [isReady] = hook.result.current;

  expect(isReady()).toBe(false);
  hook.unmount();
  expect(isReady()).toBe(null);

  [, hook] = getHook();
  [isReady] = hook.result.current;
  waitFor(() => {
    expect(isReady()).toBe(true);
  });
  vi.advanceTimersByTime(5);
});

it('second function should cancel timeout', () => {
  const [spy, hook] = getHook();
  const [isReady, cancel] = hook.result.current;

  expect(spy).toHaveBeenCalledTimes(1);
  expect(isReady()).toBe(false);

  act(() => {
    cancel();
  });
  vi.advanceTimersByTime(5);

  expect(spy).toHaveBeenCalledTimes(1);
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

  waitFor(() => {
    expect(spy).toHaveBeenCalledTimes(2);
    expect(isReady()).toBe(true);
  });

  vi.advanceTimersByTime(5);
});

it('should reset timeout on delay change', () => {
  const [spy, hook] = getHook(15);

  expect(spy).toHaveBeenCalledTimes(1);
  hook.rerender({ delay: 5 });

  waitFor(() => {
    expect(spy).toHaveBeenCalledTimes(3);
  });

  vi.advanceTimersByTime(15);
});
