import { useMemo } from '@lynx-js/react';
import type { MainThread, MouseEvent, Touch, TouchEvent } from '@lynx-js/types';

type PointerAction =
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointercancel';
type BindingMode = 'bind' | 'catch' | 'capture-bind' | 'capture-catch';
type PointerTouchEventName =
  | 'touchstart'
  | 'touchmove'
  | 'touchend'
  | 'touchcancel';
type PointerMouseEventName = 'mousedown' | 'mousemove' | 'mouseup';
type PointerActionName = 'Down' | 'Move' | 'Up' | 'Cancel';
type CallbackPrefix = 'on' | 'catch' | 'captureBind' | 'captureCatch';
type PointerCallbackName =
  `${CallbackPrefix}Pointer${PointerActionName}${'' | 'MT'}`;
type EventProp<EventName extends string> = `${BindingMode}${EventName}`;
type MainThreadEventProp<EventName extends string> =
  `main-thread:${EventProp<EventName>}`;

type OptionalHandlers<Key extends string, Event> = {
  [K in Key]?: (event: Event) => void;
};

interface CustomPointerEvent {
  type: PointerAction;
  pointerType: 'mouse' | 'touch';
  x: number;
  y: number;
  pointerId: number;
  isPrimary: boolean;
  pageX?: number;
  pageY?: number;
  clientX?: number;
  clientY?: number;
  button?: number;
  buttons?: number;
  identifier?: number;
  originalEvent: unknown;
}

type UsePointerEventReturn =
  & OptionalHandlers<EventProp<PointerMouseEventName>, MouseEvent>
  & OptionalHandlers<EventProp<PointerTouchEventName>, TouchEvent>
  & OptionalHandlers<MainThreadEventProp<PointerMouseEventName>, MainThread.MouseEvent>
  & OptionalHandlers<MainThreadEventProp<PointerTouchEventName>, MainThread.TouchEvent>;

type UsePointerEventOptions =
  & OptionalHandlers<
    Exclude<PointerCallbackName, `${string}MT`>,
    CustomPointerEvent
  >
  & OptionalHandlers<
    Extract<PointerCallbackName, `${string}MT`>,
    CustomPointerEventMT
  >;

interface CustomPointerEventMT extends CustomPointerEvent {
  target: MainThread.Element;
  currentTarget: MainThread.Element;
  originalEvent: MainThread.MouseEvent | MainThread.TouchEvent;
}

const bindingModes = [
  { eventPrefix: 'bind', callbackPrefix: 'on' },
  { eventPrefix: 'catch', callbackPrefix: 'catch' },
  { eventPrefix: 'capture-bind', callbackPrefix: 'captureBind' },
  { eventPrefix: 'capture-catch', callbackPrefix: 'captureCatch' },
] as const satisfies ReadonlyArray<{
  eventPrefix: BindingMode;
  callbackPrefix: CallbackPrefix;
}>;

const pointerActions = [
  {
    name: 'Down',
    mouseEvent: 'mousedown',
    touchEvent: 'touchstart',
    action: 'pointerdown',
  },
  {
    name: 'Move',
    mouseEvent: 'mousemove',
    touchEvent: 'touchmove',
    action: 'pointermove',
  },
  {
    name: 'Up',
    mouseEvent: 'mouseup',
    touchEvent: 'touchend',
    action: 'pointerup',
  },
  {
    name: 'Cancel',
    mouseEvent: undefined,
    touchEvent: 'touchcancel',
    action: 'pointercancel',
  },
] as const satisfies ReadonlyArray<{
  name: PointerActionName;
  mouseEvent?: PointerMouseEventName;
  touchEvent: PointerTouchEventName;
  action: PointerAction;
}>;

const pointerCallbackKeys = pointerActions.flatMap(({ name }) =>
  bindingModes.flatMap(({ callbackPrefix }) => [
    `${callbackPrefix}Pointer${name}`,
    `${callbackPrefix}Pointer${name}MT`,
  ])
) as PointerCallbackName[];

function unifyPointerEvent(
  event: MouseEvent | TouchEvent,
  type: PointerAction,
): CustomPointerEvent {
  'background only';
  const isTouch = 'touches' in (event as unknown as Record<string, unknown>)
    || 'changedTouches' in (event as unknown as Record<string, unknown>);
  if (isTouch) {
    const te = event as TouchEvent;
    const t: Touch | undefined = te.touches?.[0] ?? te.changedTouches?.[0];
    const pointerId = t?.identifier ?? 0;
    const touchesLen = te.touches?.length ?? 0;
    const primaryId = te.touches?.[0]?.identifier;
    const isPrimary = touchesLen <= 1 || pointerId === primaryId;
    return {
      type,
      pointerType: 'touch',
      x: t?.pageX,
      y: t?.pageY,
      pointerId,
      isPrimary,
      pageX: t?.pageX,
      pageY: t?.pageY,
      clientX: t?.clientX,
      clientY: t?.clientY,
      originalEvent: event,
    };
  }
  const mouse = event as MouseEvent;
  const mapButton = (b?: number): number | undefined => {
    if (b == null) return undefined;
    if (b === 1) return 0;
    if (b === 2) return 2;
    if (b === 3) return 1;
    return b;
  };
  return {
    type,
    pointerType: 'mouse',
    x: mouse.x,
    y: mouse.y,
    pointerId: 1,
    isPrimary: true,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
    button: mapButton(mouse.button),
    buttons: mouse.buttons,
    originalEvent: mouse,
  };
}

function unifyPointerEventMT(
  event: MainThread.MouseEvent | MainThread.TouchEvent,
  type: PointerAction,
): CustomPointerEventMT {
  'main thread';
  const isTouch = 'touches' in (event as unknown as Record<string, unknown>)
    || 'changedTouches' in (event as unknown as Record<string, unknown>);
  if (isTouch) {
    const te = event as MainThread.TouchEvent;
    const t: Touch | undefined = te.touches?.[0] ?? te.changedTouches?.[0];
    const pointerId = t?.identifier ?? 0;
    const touchesLen = te.touches?.length ?? 0;
    const primaryId = te.touches?.[0]?.identifier;
    const isPrimary = touchesLen <= 1 || pointerId === primaryId;
    return {
      type,
      pointerType: 'touch',
      x: t?.pageX,
      y: t?.pageY,
      pointerId,
      isPrimary,
      pageX: t?.pageX,
      pageY: t?.pageY,
      clientX: t?.clientX,
      clientY: t?.clientY,
      target: event.target,
      currentTarget: event.currentTarget,
      originalEvent: event,
    };
  }
  const mouse = event as MainThread.MouseEvent;
  const mapButton = (b?: number): number | undefined => {
    if (b == null) return undefined;
    if (b === 1) return 0;
    if (b === 2) return 2;
    if (b === 3) return 1;
    return b;
  };
  return {
    type,
    pointerType: 'mouse',
    x: mouse.x,
    y: mouse.y,
    pointerId: 1,
    isPrimary: true,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
    button: mapButton(mouse.button),
    buttons: mouse.buttons,
    target: mouse.target,
    currentTarget: mouse.currentTarget,
    originalEvent: mouse,
  };
}

// BG helpers are inlined inside unifyPointerEvent for parity with MT

// MT helpers inlined in unifyPointerEventMT to ensure MT-only call chain

// Button mapping is inlined in both BG and MT normalizers

function addPointerHandler(
  result: UsePointerEventReturn,
  mode: BindingMode,
  mouseEvent: PointerMouseEventName | undefined,
  touchEvent: PointerTouchEventName,
  action: PointerAction,
  handler: ((event: CustomPointerEvent) => void) | undefined,
) {
  if (!handler) return;

  const target = result as Record<string, unknown>;
  if (mouseEvent) {
    target[`${mode}${mouseEvent}`] = (event: MouseEvent) => {
      'background only';
      handler(unifyPointerEvent(event, action));
    };
  }
  target[`${mode}${touchEvent}`] = (event: TouchEvent) => {
    'background only';
    handler(unifyPointerEvent(event, action));
  };
}

function addPointerHandlerMT(
  result: UsePointerEventReturn,
  mode: BindingMode,
  mouseEvent: PointerMouseEventName | undefined,
  touchEvent: PointerTouchEventName,
  action: PointerAction,
  handler: ((event: CustomPointerEventMT) => void) | undefined,
) {
  if (!handler) return;

  const target = result as Record<string, unknown>;
  if (mouseEvent) {
    target[`main-thread:${mode}${mouseEvent}`] = (event: MainThread.MouseEvent) => {
      'main thread';
      handler(unifyPointerEventMT(event, action));
    };
  }
  target[`main-thread:${mode}${touchEvent}`] = (event: MainThread.TouchEvent) => {
    'main thread';
    handler(unifyPointerEventMT(event, action));
  };
}

function usePointerEvent(options: UsePointerEventOptions): UsePointerEventReturn {
  const dependencies = pointerCallbackKeys.map((key) => options[key]);
  const result = useMemo<UsePointerEventReturn>(() => {
    const r: UsePointerEventReturn = {};

    for (const mode of bindingModes) {
      for (const action of pointerActions) {
        const callbackKey =
          `${mode.callbackPrefix}Pointer${action.name}` as PointerCallbackName;
        const callbackMTKey =
          `${mode.callbackPrefix}Pointer${action.name}MT` as PointerCallbackName;

        addPointerHandler(
          r,
          mode.eventPrefix,
          action.mouseEvent,
          action.touchEvent,
          action.action,
          options[callbackKey] as
            | ((event: CustomPointerEvent) => void)
            | undefined,
        );
        addPointerHandlerMT(
          r,
          mode.eventPrefix,
          action.mouseEvent,
          action.touchEvent,
          action.action,
          options[callbackMTKey] as
            | ((event: CustomPointerEventMT) => void)
            | undefined,
        );
      }
    }

    return r;
  }, dependencies);

  return result;
}

export default usePointerEvent;
export type { CustomPointerEvent, CustomPointerEventMT };
