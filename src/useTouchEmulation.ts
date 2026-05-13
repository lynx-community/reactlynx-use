import { useMemo } from '@lynx-js/react';
import type { MainThread, MouseEvent, Touch, TouchEvent } from '@lynx-js/types';

type TouchAction = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';
type BindingMode = 'bind' | 'catch' | 'capture-bind' | 'capture-catch';
type TouchEventName = TouchAction;
type MouseEventName = 'mousedown' | 'mousemove' | 'mouseup';
type TouchActionName = 'Start' | 'Move' | 'End' | 'Cancel';
type CallbackPrefix = 'on' | 'catch' | 'captureBind' | 'captureCatch';
type TouchCallbackName =
  `${CallbackPrefix}Touch${TouchActionName}${'' | 'MT'}`;
type EventProp<EventName extends string> = `${BindingMode}${EventName}`;
type MainThreadEventProp<EventName extends string> =
  `main-thread:${EventProp<EventName>}`;

type OptionalHandlers<Key extends string, Event> = {
  [K in Key]?: (event: Event) => void;
};

type UseTouchEmulationReturn =
  & OptionalHandlers<EventProp<TouchEventName>, TouchEvent>
  & OptionalHandlers<EventProp<MouseEventName>, MouseEvent>
  & OptionalHandlers<MainThreadEventProp<TouchEventName>, MainThread.TouchEvent>
  & OptionalHandlers<MainThreadEventProp<MouseEventName>, MainThread.MouseEvent>;

type UseTouchEmulationOptions =
  & OptionalHandlers<Exclude<TouchCallbackName, `${string}MT`>, TouchEvent>
  & OptionalHandlers<Extract<TouchCallbackName, `${string}MT`>, MainThread.TouchEvent>;

const bindingModes = [
  { eventPrefix: 'bind', callbackPrefix: 'on' },
  { eventPrefix: 'catch', callbackPrefix: 'catch' },
  { eventPrefix: 'capture-bind', callbackPrefix: 'captureBind' },
  { eventPrefix: 'capture-catch', callbackPrefix: 'captureCatch' },
] as const satisfies ReadonlyArray<{
  eventPrefix: BindingMode;
  callbackPrefix: CallbackPrefix;
}>;

const touchActions = [
  {
    name: 'Start',
    touchEvent: 'touchstart',
    mouseEvent: 'mousedown',
    action: 'touchstart',
  },
  {
    name: 'Move',
    touchEvent: 'touchmove',
    mouseEvent: 'mousemove',
    action: 'touchmove',
  },
  {
    name: 'End',
    touchEvent: 'touchend',
    mouseEvent: 'mouseup',
    action: 'touchend',
  },
  {
    name: 'Cancel',
    touchEvent: 'touchcancel',
    mouseEvent: undefined,
    action: 'touchcancel',
  },
] as const satisfies ReadonlyArray<{
  name: TouchActionName;
  touchEvent: TouchEventName;
  mouseEvent?: MouseEventName;
  action: TouchAction;
}>;

const touchCallbackKeys = touchActions.flatMap(({ name }) =>
  bindingModes.flatMap(({ callbackPrefix }) => [
    `${callbackPrefix}Touch${name}`,
    `${callbackPrefix}Touch${name}MT`,
  ])
) as TouchCallbackName[];

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

function addTouchHandler(
  result: UseTouchEmulationReturn,
  mode: BindingMode,
  touchEvent: TouchEventName,
  mouseEvent: MouseEventName | undefined,
  action: TouchAction,
  handler: ((event: TouchEvent) => void) | undefined,
) {
  if (!handler) return;

  const target = result as Record<string, unknown>;
  target[`${mode}${touchEvent}`] = (event: TouchEvent) => {
    'background only';
    handler(toTouchEvent(event, action));
  };

  if (!mouseEvent) return;
  target[`${mode}${mouseEvent}`] = (event: MouseEvent) => {
    'background only';
    if (action === 'touchmove') {
      const buttons = (event as unknown as { buttons?: number }).buttons;
      // Allow only left-button drags
      if (!buttons || (buttons & 1) === 0) return;
    }
    handler(toTouchEvent(event, action));
  };
}

function addTouchHandlerMT(
  result: UseTouchEmulationReturn,
  mode: BindingMode,
  touchEvent: TouchEventName,
  mouseEvent: MouseEventName | undefined,
  action: TouchAction,
  handler: ((event: MainThread.TouchEvent) => void) | undefined,
) {
  if (!handler) return;

  const target = result as Record<string, unknown>;
  target[`main-thread:${mode}${touchEvent}`] = (event: MainThread.TouchEvent) => {
    'main thread';
    handler(toTouchEventMT(event, action));
  };

  if (!mouseEvent) return;
  target[`main-thread:${mode}${mouseEvent}`] = (event: MainThread.MouseEvent) => {
    'main thread';
    if (action === 'touchmove') {
      const buttons = (event as unknown as { buttons?: number }).buttons;
      // Allow only left-button drags
      if (!buttons || (buttons & 1) === 0) return;
    }
    handler(toTouchEventMT(event, action));
  };
}

function useTouchEmulation(
  options: UseTouchEmulationOptions,
): UseTouchEmulationReturn {
  const dependencies = touchCallbackKeys.map((key) => options[key]);
  const result = useMemo<UseTouchEmulationReturn>(() => {
    const r: UseTouchEmulationReturn = {};

    for (const mode of bindingModes) {
      for (const action of touchActions) {
        const callbackKey =
          `${mode.callbackPrefix}Touch${action.name}` as TouchCallbackName;
        const callbackMTKey =
          `${mode.callbackPrefix}Touch${action.name}MT` as TouchCallbackName;

        addTouchHandler(
          r,
          mode.eventPrefix,
          action.touchEvent,
          action.mouseEvent,
          action.action,
          options[callbackKey] as ((event: TouchEvent) => void) | undefined,
        );
        addTouchHandlerMT(
          r,
          mode.eventPrefix,
          action.touchEvent,
          action.mouseEvent,
          action.action,
          options[callbackMTKey] as
            | ((event: MainThread.TouchEvent) => void)
            | undefined,
        );
      }
    }

    return r;
  }, dependencies);

  return result;
}

export default useTouchEmulation;
