import {
  type MainThreadRef,
  runOnMainThread,
  useMainThreadRef,
} from '@lynx-js/react';
import { fireEvent, render } from '@lynx-js/react/testing-library';
import type { MainThread } from '@lynx-js/types';
import { describe, expect, it, vi } from 'vitest';
import useTouchEmulation from '../src/useTouchEmulation';

describe('useTouchEmulation (BT) integration', () => {
  it('synthesizes touch from mouse down', () => {
    const onTouchStart = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchStart });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.mousedown(container.firstChild, {
      x: 10,
      y: 20,
      pageX: 110,
      pageY: 120,
      clientX: 210,
      clientY: 220,
    });
    expect(onTouchStart).toHaveBeenCalledTimes(1);
    const e = onTouchStart.mock.calls[0][0] as unknown as TouchEvent;
    // synthesized touch event fields
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(110);
    // @ts-expect-error test environment type narrowing
    expect(e.detail.y).toBe(120);
    expect(e.touches.length).toBe(1);
    expect(e.changedTouches.length).toBe(1);
    expect(e.touches[0].clientX).toBe(210);
    expect(e.touches[0].pageY).toBe(120);
  });

  it('passes through native touch start', () => {
    const onTouchStart = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchStart });

      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.touchstart(container.firstChild, {
      detail: { x: 50, y: 60 },
      touches: [{
        identifier: 2,
        x: 0,
        y: 0,
        pageX: 151,
        pageY: 161,
        clientX: 251,
        clientY: 261,
      }],
    });
    expect(onTouchStart).toHaveBeenCalledTimes(1);
    const e = onTouchStart.mock.calls[0][0] as unknown as TouchEvent;
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(50);
    expect(e.touches[0].identifier).toBe(2);
    expect(e.touches[0].clientY).toBe(261);
  });

  it('synthesizes touchend from mouseup with empty touches', () => {
    const onTouchEnd = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchEnd });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.mouseup(container.firstChild, {
      x: 1,
      y: 2,
      pageX: 101,
      pageY: 102,
      clientX: 201,
      clientY: 202,
    });
    expect(onTouchEnd).toHaveBeenCalledTimes(1);
    const e = onTouchEnd.mock.calls[0][0] as unknown as TouchEvent;
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(101);
    expect(e.touches.length).toBe(0);
    expect(e.changedTouches.length).toBe(1);
  });
});

describe('useTouchEmulation memoization', () => {
  it('keeps props identity stable when handlers do not change', () => {
    const onTouchStart = vi.fn();
    const onTouchMove = vi.fn();
    let lastProps: ReturnType<typeof useTouchEmulation> | undefined;

    const Comp = ({ move }: { move: (e: unknown) => void }) => {
      const props = useTouchEmulation({ onTouchStart, onTouchMove: move });
      lastProps = props;
      return <view {...props}></view>;
    };

    const { rerender } = render(<Comp move={onTouchMove} />);
    const first = lastProps;
    rerender(<Comp move={onTouchMove} />);
    expect(lastProps).toBe(first);
  });

  it('recreates props identity when a handler changes', () => {
    const onTouchStart = vi.fn();
    const onTouchMove1 = vi.fn();
    const onTouchMove2 = vi.fn();
    let lastProps: ReturnType<typeof useTouchEmulation> | undefined;

    const Comp = ({ move }: { move: (e: unknown) => void }) => {
      const props = useTouchEmulation({ onTouchStart, onTouchMove: move });
      lastProps = props;
      return <view {...props}></view>;
    };

    const { rerender } = render(<Comp move={onTouchMove1} />);
    const first = lastProps!;
    rerender(<Comp move={onTouchMove2} />);
    expect(lastProps).not.toBe(first);
    expect(lastProps?.bindmousemove).not.toBe(first.bindmousemove);
  });
});

describe('useTouchEmulation event semantics', () => {
  it('BT: synthetic move from mousemove has correct coordinates', () => {
    const onTouchMove = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchMove });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    // Gate, then move
    fireEvent.mousedown(container.firstChild, {
      pageX: 10,
      pageY: 20,
      clientX: 30,
      clientY: 40,
    });
    fireEvent.mousemove(container.firstChild, {
      pageX: 15,
      pageY: 25,
      clientX: 35,
      clientY: 45,
      buttons: 1,
    });
    const e = onTouchMove.mock.calls[0][0] as unknown as TouchEvent;
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(15);
    expect(e.touches.length).toBe(1);
    expect(e.touches[0].pageY).toBe(25);
    expect(e.touches[0].clientX).toBe(35);
  });

  it('BT: passes through native touchmove', () => {
    const onTouchMove = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchMove });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.touchmove(container.firstChild, {
      detail: { x: 200, y: 100 },
      touches: [{
        identifier: 3,
        pageX: 200,
        pageY: 100,
        clientX: 300,
        clientY: 150,
      }],
    });
    const e = onTouchMove.mock.calls[0][0] as unknown as TouchEvent;
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(200);
    expect(e.touches[0].identifier).toBe(3);
    expect(e.touches[0].clientY).toBe(150);
  });

  it('MT: synthetic move from mousemove has correct coordinates', async () => {
    let mtEventRef: MainThreadRef<MainThread.TouchEvent | null>;
    const Comp = () => {
      mtEventRef = useMainThreadRef<MainThread.TouchEvent>(null);
      const props = useTouchEmulation({
        onTouchMoveMT: (e) => {
          'main thread';
          mtEventRef.current = e;
        },
      });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.mousedown(container.firstChild, { pageX: 10, pageY: 20 });
    fireEvent.mousemove(container.firstChild, {
      pageX: 15,
      pageY: 25,
      buttons: 1,
    });
    const read = runOnMainThread(() => {
      'main thread';
      return mtEventRef?.current;
    });
    const e = await read();
    // @ts-expect-error test environment type narrowing
    expect(e?.detail.x).toBe(15);
    // @ts-expect-error test environment type narrowing
    expect(e?.touches.length).toBe(1);
  });
});
describe('useTouchEmulation (MT) integration', () => {
  it('synthesizes MT touch from mouse down', async () => {
    let mtEventRef: MainThreadRef<MainThread.TouchEvent | null>;
    const Comp = () => {
      mtEventRef = useMainThreadRef<MainThread.TouchEvent>(null);
      const props = useTouchEmulation({
        onTouchStartMT: (e) => {
          'main thread';
          mtEventRef.current = e;
        },
      });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.mousedown(container.firstChild, {
      x: 15,
      y: 25,
      pageX: 115,
      pageY: 125,
      clientX: 215,
      clientY: 225,
    });
    const read = runOnMainThread(() => {
      'main thread';
      return mtEventRef?.current;
    });
    const e = await read();
    // @ts-expect-error test environment type narrowing
    expect(e?.detail.x).toBe(115);
    // @ts-expect-error test environment type narrowing
    expect(e?.touches.length).toBe(1);
    // target/currentTarget may be omitted in test env
  });
});

describe('useTouchEmulation cancel behavior', () => {
  it('BT: touchend triggers onTouchEnd only; touchcancel is separate', () => {
    const onTouchEnd = vi.fn();
    const onTouchCancel = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchEnd, onTouchCancel });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.touchend(container.firstChild, {
      detail: { x: 5, y: 6 },
      touches: [],
    });
    expect(onTouchEnd).toHaveBeenCalledTimes(1);
    expect(onTouchCancel).toHaveBeenCalledTimes(0);
  });

  it('MT: touchcancel triggers onTouchCancelMT when provided', async () => {
    let mtCalledRef: MainThreadRef<boolean>;
    const Comp = () => {
      mtCalledRef = useMainThreadRef<boolean>(false);
      const props = useTouchEmulation({
        onTouchCancelMT: () => {
          'main thread';
          mtCalledRef.current = true;
        },
      });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    fireEvent.touchcancel(container.firstChild, {
      detail: { x: 7, y: 8 },
      touches: [],
    });
    const read = runOnMainThread(() => {
      'main thread';
      return mtCalledRef?.current;
    });
    const called = await read();
    expect(called).toBe(true);
  });
});

describe('useTouchEmulation mouse gating behavior', () => {
  it('BT: mousemove only triggers after mousedown and stops after mouseup', () => {
    const onTouchMove = vi.fn();
    const Comp = () => {
      const props = useTouchEmulation({ onTouchMove });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    // Move without press should not trigger
    fireEvent.mousemove(container.firstChild, { pageX: 10, pageY: 20 });
    expect(onTouchMove).toHaveBeenCalledTimes(0);
    // Press sets active and then move should trigger
    fireEvent.mousedown(container.firstChild, { pageX: 10, pageY: 20 });
    fireEvent.mousemove(container.firstChild, {
      pageX: 15,
      pageY: 25,
      buttons: 1,
    });
    expect(onTouchMove).toHaveBeenCalledTimes(1);
    // Release resets active and subsequent move should not trigger
    fireEvent.mouseup(container.firstChild, { pageX: 15, pageY: 25 });
    fireEvent.mousemove(container.firstChild, { pageX: 20, pageY: 30 });
    expect(onTouchMove).toHaveBeenCalledTimes(1);
  });

  it('MT: mousemove only triggers after mousedown and stops after mouseup', async () => {
    let callCountRef: MainThreadRef<number>;
    const Comp = () => {
      callCountRef = useMainThreadRef<number>(0);
      const props = useTouchEmulation({
        onTouchMoveMT: () => {
          'main thread';
          callCountRef.current = (callCountRef.current ?? 0) + 1;
        },
      });
      return <view {...props}></view>;
    };
    const { container } = render(<Comp />);
    // Move without press should not trigger
    fireEvent.mousemove(container.firstChild, { pageX: 10, pageY: 20 });
    const read1 = runOnMainThread(() => {
      'main thread';
      return (callCountRef?.current ?? 0);
    });
    expect(await read1()).toBe(0);
    // Press sets active and then move should trigger
    fireEvent.mousedown(container.firstChild, { pageX: 10, pageY: 20 });
    fireEvent.mousemove(container.firstChild, {
      pageX: 15,
      pageY: 25,
      buttons: 1,
    });
    const read2 = runOnMainThread(() => {
      'main thread';
      return (callCountRef?.current ?? 0);
    });
    expect(await read2()).toBe(1);
    // Release resets active and subsequent move should not trigger
    fireEvent.mouseup(container.firstChild, { pageX: 15, pageY: 25 });
    fireEvent.mousemove(container.firstChild, { pageX: 20, pageY: 30 });
    const read3 = runOnMainThread(() => {
      'main thread';
      return (callCountRef?.current ?? 0);
    });
    expect(await read3()).toBe(1);
  });
});
