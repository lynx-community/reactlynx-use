import {
  type MainThreadRef,
  runOnMainThread,
  useMainThreadRef,
} from '@lynx-js/react';
import {
  act,
  render,
  waitFor,
} from '@lynx-js/react/testing-library';
import type { MainThread } from '@lynx-js/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useComputedStyle from '../src/useComputedStyle';

interface ComputedStyleTestElement extends MainThread.Element {
  getComputedStyleProperty(key: string): string;
}

interface ComputedStyleTestGlobal {
  __useComputedStylePropertyReads?: number;
  __useComputedStylePrototype?: ComputedStyleTestElement;
  __useComputedStyleOriginal?: PropertyDescriptor;
  __useComputedStyleThrows?: boolean;
}

function installComputedStyleProperty(
  targetRef: MainThreadRef<MainThread.Element | null>,
) {
  'main thread';
  const element = targetRef.current;
  if (!element) {
    return false;
  }

  const prototype = Object.getPrototypeOf(element) as ComputedStyleTestElement;
  const testGlobal = globalThis as typeof globalThis
    & ComputedStyleTestGlobal;

  // Remember whatever the environment provides so the stub cannot leak into
  // any other test that renders a main-thread element.
  testGlobal.__useComputedStylePrototype = prototype;
  testGlobal.__useComputedStyleOriginal = Object.getOwnPropertyDescriptor(
    prototype,
    'getComputedStyleProperty',
  );

  prototype.getComputedStyleProperty = function getComputedStyleProperty(
    this: MainThread.Element,
    key: string,
  ) {
    testGlobal.__useComputedStylePropertyReads =
      (testGlobal.__useComputedStylePropertyReads ?? 0) + 1;
    if (testGlobal.__useComputedStyleThrows) {
      // Matches what the real reader does below Lynx SDK 3.5.
      throw new Error('getComputedStyleProperty requires Lynx sdk version 3.5');
    }
    return String(this.getAttribute(`data-${key}`) ?? '');
  };

  testGlobal.__useComputedStylePropertyReads = 0;
  testGlobal.__useComputedStyleThrows = false;
  return true;
}

function restoreComputedStyleProperty() {
  'main thread';
  const testGlobal = globalThis as typeof globalThis
    & ComputedStyleTestGlobal;
  const prototype = testGlobal.__useComputedStylePrototype;
  if (!prototype) {
    return false;
  }

  const original = testGlobal.__useComputedStyleOriginal;
  if (original) {
    Object.defineProperty(prototype, 'getComputedStyleProperty', original);
  } else {
    delete (prototype as Partial<ComputedStyleTestElement>)
      .getComputedStyleProperty;
  }

  testGlobal.__useComputedStylePrototype = undefined;
  testGlobal.__useComputedStyleOriginal = undefined;
  testGlobal.__useComputedStyleThrows = false;
  return true;
}

function setComputedStylePropertyThrows(shouldThrow: boolean) {
  'main thread';
  const testGlobal = globalThis as typeof globalThis
    & ComputedStyleTestGlobal;
  testGlobal.__useComputedStyleThrows = shouldThrow;
}

function readComputedStylePropertyCount() {
  'main thread';
  const testGlobal = globalThis as typeof globalThis
    & ComputedStyleTestGlobal;
  return testGlobal.__useComputedStylePropertyReads ?? 0;
}

function mainThreadBarrier() {
  'main thread';
}

async function getReadCount() {
  return runOnMainThread(readComputedStylePropertyCount)();
}

async function waitForReadCount(expected: number) {
  await waitFor(async () => {
    expect(await getReadCount()).toBe(expected);
  });
}

async function flushThreadWork() {
  await act(async () => {
    await runOnMainThread(mainThreadBarrier)();
    await Promise.resolve();
  });
}

describe('useComputedStyle', () => {
  beforeEach(async () => {
    // The test environment implements MTS requestAnimationFrame with Node's
    // setTimeout, which otherwise invokes the callback after it has switched
    // back to the background-thread globals. Keep the callback on MTS, as the
    // native Lynx scheduler does.
    lynxTestingEnv.mainThread.globalThis.requestAnimationFrame = callback => {
      setTimeout(() => {
        lynxTestingEnv.switchToMainThread();
        try {
          callback?.(0);
        } finally {
          lynxTestingEnv.switchToBackgroundThread();
        }
      }, 0);
      return 0;
    };

    let bootstrapRef!: MainThreadRef<MainThread.Element | null>;

    function Bootstrap() {
      bootstrapRef = useMainThreadRef<MainThread.Element | null>(null);
      return <view main-thread:ref={bootstrapRef} />;
    }

    const bootstrap = render(<Bootstrap />);
    const installed = await runOnMainThread(installComputedStyleProperty)(
      bootstrapRef,
    );
    bootstrap.unmount();
    lynxTestingEnv.switchToBackgroundThread();

    expect(installed).toBe(true);
  });

  afterEach(async () => {
    await runOnMainThread(restoreComputedStyleProperty)();
    lynxTestingEnv.switchToBackgroundThread();
  });

  it('reads each requested property on the main thread after mount', async () => {
    let latestStyles: Record<string, string | undefined> = {};

    function TestComponent() {
      const [ref, styles] = useComputedStyle(['color', 'opacity']);
      latestStyles = styles;
      return (
        <view
          main-thread:ref={ref}
          data-color="rgb(26, 115, 232)"
          data-opacity="0.8"
        />
      );
    }

    render(<TestComponent />);

    await waitFor(() => {
      expect(latestStyles).toEqual({
        color: 'rgb(26, 115, 232)',
        opacity: '0.8',
      });
    });
    expect(await getReadCount()).toBe(2);
  });

  it('re-reads after an explicit dependency changes', async () => {
    let latestStyles: Record<string, string | undefined> = {};

    function TestComponent({
      color,
      themeIndex,
    }: {
      color: string;
      themeIndex: number;
    }) {
      const [ref, styles] = useComputedStyle(['color'], [themeIndex]);
      latestStyles = styles;
      return (
        <view main-thread:ref={ref} data-color={color} />
      );
    }

    const rendered = render(
      <TestComponent color="rgb(26, 115, 232)" themeIndex={0} />,
    );
    await waitFor(() => {
      expect(latestStyles.color).toBe('rgb(26, 115, 232)');
    });

    rendered.rerender(
      <TestComponent color="rgb(217, 48, 37)" themeIndex={1} />,
    );

    await waitFor(() => {
      expect(latestStyles.color).toBe('rgb(217, 48, 37)');
    });
    expect(await getReadCount()).toBe(2);
  });

  it('re-reads when the requested keys change', async () => {
    let latestStyles: Record<string, string | undefined> = {};

    function TestComponent({ keys }: { keys: string[] }) {
      const [ref, styles] = useComputedStyle(keys);
      latestStyles = styles;
      return (
        <view
          main-thread:ref={ref}
          data-color="rgb(26, 115, 232)"
          data-opacity="0.8"
        />
      );
    }

    const rendered = render(<TestComponent keys={['color']} />);
    await waitFor(() => {
      expect(latestStyles).toEqual({ color: 'rgb(26, 115, 232)' });
    });

    rendered.rerender(<TestComponent keys={['opacity']} />);
    await waitFor(() => {
      expect(latestStyles).toEqual({ opacity: '0.8' });
    });
  });

  it('omits a key the engine cannot report instead of reporting an empty value', async () => {
    let latestStyles: Record<string, string | undefined> = {};

    function TestComponent() {
      const [ref, styles] = useComputedStyle(['color', 'mask-repeat']);
      latestStyles = styles;
      return <view main-thread:ref={ref} data-color="rgb(26, 115, 232)" />;
    }

    render(<TestComponent />);

    await waitFor(() => {
      expect(latestStyles.color).toBe('rgb(26, 115, 232)');
    });
    await flushThreadWork();

    // `mask-repeat` resolves to an empty string here, the same way the engine
    // reports a property it has no getter for. The key must stay absent so a
    // consumer prop keeps its own fallback.
    expect('mask-repeat' in latestStyles).toBe(false);
    expect(latestStyles['mask-repeat']).toBeUndefined();
  });

  it('does not let an unsupported-SDK failure escape the main thread', async () => {
    const mainThreadConsole = lynxTestingEnv.mainThread.globalThis.console;
    const warn = vi.spyOn(mainThreadConsole, 'warn').mockImplementation(
      () => {},
    );
    await runOnMainThread(setComputedStylePropertyThrows)(true);
    lynxTestingEnv.switchToBackgroundThread();

    let latestStyles: Record<string, string | undefined> = {};

    function TestComponent() {
      const [ref, styles] = useComputedStyle(['color']);
      latestStyles = styles;
      return <view main-thread:ref={ref} data-color="rgb(26, 115, 232)" />;
    }

    render(<TestComponent />);
    await waitForReadCount(1);
    await flushThreadWork();
    await flushThreadWork();

    // Failing open: no value, no throw, and the consumer keeps its fallback.
    expect(latestStyles).toEqual({});
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('preserves the styles object when a re-read returns unchanged values', async () => {
    let latestStyles: Record<string, string | undefined> = {};
    let renderCount = 0;

    function TestComponent({ dependency }: { dependency: number }) {
      renderCount += 1;
      const [ref, styles] = useComputedStyle(['color'], [dependency]);
      latestStyles = styles;
      return (
        <view
          main-thread:ref={ref}
          data-color="rgb(26, 115, 232)"
        />
      );
    }

    const rendered = render(<TestComponent dependency={0} />);
    await waitFor(() => {
      expect(latestStyles.color).toBe('rgb(26, 115, 232)');
    });
    const stableStyles = latestStyles;
    const rendersBeforeDependencyChange = renderCount;

    rendered.rerender(<TestComponent dependency={1} />);
    await waitForReadCount(2);
    await flushThreadWork();

    expect(latestStyles).toBe(stableStyles);
    expect(renderCount).toBe(rendersBeforeDependencyChange + 1);
  });

  it('keeps the main-thread ref stable and does not enter a render loop', async () => {
    let firstRef: MainThreadRef<MainThread.Element | null> | undefined;
    let latestRef: MainThreadRef<MainThread.Element | null> | undefined;
    let latestStyles: Record<string, string | undefined> = {};
    let renderCount = 0;

    function TestComponent() {
      renderCount += 1;
      const [ref, styles] = useComputedStyle(['color']);
      firstRef ??= ref;
      latestRef = ref;
      latestStyles = styles;
      return (
        <view
          main-thread:ref={ref}
          data-color="rgb(26, 115, 232)"
        />
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(latestStyles.color).toBe('rgb(26, 115, 232)');
    });
    const settledRenderCount = renderCount;

    await flushThreadWork();
    await flushThreadWork();
    await flushThreadWork();

    expect(latestRef).toBe(firstRef);
    expect(renderCount).toBe(settledRenderCount);
    expect(await getReadCount()).toBe(1);
  });
});
