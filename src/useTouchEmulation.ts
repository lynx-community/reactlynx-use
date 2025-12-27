import { useMemo } from '@lynx-js/react';
import type { MainThread, MouseEvent, Touch, TouchEvent } from '@lynx-js/types';

type TouchAction = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';

interface UseTouchEmulationReturn {
  bindtouchstart?: (e: TouchEvent) => void;
  bindmousedown?: (e: MouseEvent) => void;
  bindtouchmove?: (e: TouchEvent) => void;
  bindmousemove?: (e: MouseEvent) => void;
  bindtouchend?: (e: TouchEvent) => void;
  bindtouchcancel?: (e: TouchEvent) => void;
  bindmouseup?: (e: MouseEvent) => void;
  'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void;
  'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void;
  'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void;
  'main-thread:bindtouchcancel'?: (e: MainThread.TouchEvent) => void;
}

function toTouchEvent(
  event: MouseEvent | TouchEvent,
  type: TouchAction,
): TouchEvent {
  'background only';
  const isTouch = 'touches' in (event as unknown as Record<string, unknown>)
    || 'changedTouches' in (event as unknown as Record<string, unknown>);
  if (isTouch) return event as TouchEvent;
  const mouse = event as MouseEvent;
  const touch = {
    identifier: 1,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
  } as unknown as Touch;
  const touches = type === 'touchend' ? [] : [touch];
  const changedTouches = [touch];
  return {
    detail: { x: mouse.pageX, y: mouse.pageY },
    touches,
    changedTouches,
  } as unknown as TouchEvent;
}

function toTouchEventMT(
  event: MainThread.MouseEvent | MainThread.TouchEvent,
  type: TouchAction,
): MainThread.TouchEvent {
  'main thread';
  const isTouch = 'touches' in (event as unknown as Record<string, unknown>)
    || 'changedTouches' in (event as unknown as Record<string, unknown>);
  if (isTouch) return event as MainThread.TouchEvent;
  const mouse = event as MainThread.MouseEvent;
  const touch = {
    identifier: 1,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
  } as unknown as Touch;
  const touches = type === 'touchend' ? [] : [touch];
  const changedTouches = [touch];
  return {
    detail: { x: mouse.pageX, y: mouse.pageY },
    touches,
    changedTouches,
    target: mouse.target,
    currentTarget: mouse.currentTarget,
  } as unknown as MainThread.TouchEvent;
}

function useTouchEmulation({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  onTouchStartMT,
  onTouchMoveMT,
  onTouchEndMT,
  onTouchCancelMT,
}: {
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchStartMT?: (event: MainThread.TouchEvent) => void;
  onTouchMoveMT?: (event: MainThread.TouchEvent) => void;
  onTouchEndMT?: (event: MainThread.TouchEvent) => void;
  onTouchCancelMT?: (event: MainThread.TouchEvent) => void;
}): UseTouchEmulationReturn {
  const result = useMemo<UseTouchEmulationReturn>(() => {
    const r: UseTouchEmulationReturn = {};

    if (onTouchStart) {
      r.bindtouchstart = (event: TouchEvent) => {
        'background only';
        onTouchStart(toTouchEvent(event, 'touchstart'));
      };
      r.bindmousedown = (event: MouseEvent) => {
        'background only'
        onTouchStart(toTouchEvent(event, 'touchstart'));
      };
    }

    if (onTouchMove) {
      r.bindtouchmove = (event: TouchEvent) => {
        'background only';
        onTouchMove(toTouchEvent(event, 'touchmove'));
      };
      r.bindmousemove = (event: MouseEvent) => {
        'background only';
        const buttons = (event as unknown as { buttons?: number }).buttons;
        // Allow only left-button drags
        if (!buttons || (buttons & 1) === 0) return;
        onTouchMove(toTouchEvent(event, 'touchmove'));
      };
    }

    if (onTouchEnd) {
      r.bindtouchend = (event: TouchEvent) => {
        'background only';
        onTouchEnd(toTouchEvent(event, 'touchend'));
      };
      r.bindmouseup = (event: MouseEvent) => {
        'background only';
        onTouchEnd(toTouchEvent(event, 'touchend'));
      };
    }

    if (onTouchCancel) {
      r.bindtouchcancel = (event: TouchEvent) => {
        'background only';
        onTouchCancel(toTouchEvent(event, 'touchcancel'));
      };
    }

    if (onTouchStartMT) {
      r['main-thread:bindtouchstart'] = (event: MainThread.TouchEvent) => {
        'main thread';
        onTouchStartMT(toTouchEventMT(event, 'touchstart'));
      };

      r['main-thread:bindmousedown'] = (event: MainThread.MouseEvent) => {
        'main thread';
        onTouchStartMT(toTouchEventMT(event, 'touchstart'));
      };
    }

    if (onTouchMoveMT) {
      r['main-thread:bindtouchmove'] = (event: MainThread.TouchEvent) => {
        'main thread';
        onTouchMoveMT(toTouchEventMT(event, 'touchmove'));
      };
      r['main-thread:bindmousemove'] = (event: MainThread.MouseEvent) => {
        'main thread';
        const buttons = (event as unknown as { buttons?: number }).buttons;
        // Allow only left-button drags
        if (!buttons || (buttons & 1) === 0) return;
        onTouchMoveMT(toTouchEventMT(event, 'touchmove'));
      };
    }

    if (onTouchEndMT) {
      r['main-thread:bindtouchend'] = (event: MainThread.TouchEvent) => {
        'main thread';
        onTouchEndMT(toTouchEventMT(event, 'touchend'));
      };
      r['main-thread:bindmouseup'] = (event: MainThread.MouseEvent) => {
        'main thread';
        onTouchEndMT(toTouchEventMT(event, 'touchend'));
      };
    }

    if (onTouchCancelMT) {
      r['main-thread:bindtouchcancel'] = (event: MainThread.TouchEvent) => {
        'main thread';
        onTouchCancelMT(toTouchEventMT(event, 'touchcancel'));
      };
    }

    return r;
  }, [
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onTouchStartMT,
    onTouchMoveMT,
    onTouchEndMT,
    onTouchCancelMT,
  ]);

  return result;
}

export default useTouchEmulation;
