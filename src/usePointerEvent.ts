import type { MainThread, MouseEvent, Touch, TouchEvent } from '@lynx-js/types'

type PointerAction = 'pointerdown' | 'pointermove' | 'pointerup'

interface CustomPointerEvent {
  type: PointerAction
  pointerType: 'mouse' | 'touch'
  x: number
  y: number
  pointerId: number
  isPrimary: boolean
  pageX?: number
  pageY?: number
  clientX?: number
  clientY?: number
  button?: number
  buttons?: number
  identifier?: number
  originalEvent: unknown
}

interface CustomPointerEventMT extends CustomPointerEvent {
  target: MainThread.Element
  currentTarget: MainThread.Element
  originalEvent: MainThread.MouseEvent | MainThread.TouchEvent
}

function unifyPointerEvent(
  event: MouseEvent | TouchEvent,
  type: PointerAction,
): CustomPointerEvent {
  const isTouch = 'detail' in event
  if (isTouch) {
    const te = event as TouchEvent
    const x = te.detail.x
    const y = te.detail.y
    const t: Touch | undefined = te.touches?.[0] ?? te.changedTouches?.[0]
    const pointerId = t?.identifier ?? 0
    const touchesLen = te.touches?.length ?? 0
    const primaryId = te.touches?.[0]?.identifier
    const isPrimary = touchesLen <= 1 || pointerId === primaryId
    return {
      type,
      pointerType: 'touch',
      x,
      y,
      pointerId,
      isPrimary,
      pageX: t?.pageX,
      pageY: t?.pageY,
      clientX: t?.clientX,
      clientY: t?.clientY,
      originalEvent: event,
    }
  }
  const mouse = event as MouseEvent
  const mapButton = (b?: number): number | undefined => {
    if (b == null) return undefined
    if (b === 1) return 0
    if (b === 2) return 2
    if (b === 3) return 1
    return b
  }
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
  }
}

function unifyPointerEventMT(
  event: MainThread.MouseEvent | MainThread.TouchEvent,
  type: PointerAction,
): CustomPointerEventMT {
  'main thread'
  const isTouch = 'detail' in event
  if (isTouch) {
    const te = event as MainThread.TouchEvent
    const x = te.detail.x
    const y = te.detail.y
    const t: Touch | undefined = te.touches?.[0] ?? te.changedTouches?.[0]
    const pointerId = t?.identifier ?? 0
    const touchesLen = te.touches?.length ?? 0
    const primaryId = te.touches?.[0]?.identifier
    const isPrimary = touchesLen <= 1 || pointerId === primaryId
    return {
      type,
      pointerType: 'touch',
      x,
      y,
      pointerId,
      isPrimary,
      pageX: t?.pageX,
      pageY: t?.pageY,
      clientX: t?.clientX,
      clientY: t?.clientY,
      target: event.target,
      currentTarget: event.currentTarget,
      originalEvent: event,
    }
  }
  const mouse = event as MainThread.MouseEvent
  const mapButton = (b?: number): number | undefined => {
    if (b == null) return undefined
    if (b === 1) return 0
    if (b === 2) return 2
    if (b === 3) return 1
    return b
  }
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
  }
}

// BG helpers are inlined inside unifyPointerEvent for parity with MT

// MT helpers inlined in unifyPointerEventMT to ensure MT-only call chain

// Button mapping is inlined in both BG and MT normalizers

function usePointerEvent({
  onPointerDown,
  onPointerUp,
  onPointerMove,
  onPointerUpMT,
  onPointerMoveMT,
  onPointerDownMT,
}: {
  onPointerDown?: (event: CustomPointerEvent) => void
  onPointerUp?: (event: CustomPointerEvent) => void
  onPointerMove?: (event: CustomPointerEvent) => void
  onPointerUpMT?: (event: CustomPointerEventMT) => void
  onPointerMoveMT?: (event: CustomPointerEventMT) => void
  onPointerDownMT?: (event: CustomPointerEventMT) => void
}): {
  'bindmousedown'?: (e: MouseEvent) => void
  'bindtouchstart'?: (e: TouchEvent) => void
  'bindmousemove'?: (e: MouseEvent) => void
  'bindtouchmove'?: (e: TouchEvent) => void
  'bindmouseup'?: (e: MouseEvent) => void
  'bindtouchend'?: (e: TouchEvent) => void
  'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void
  'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void
  'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void
  'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void
  'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void
  'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void
} {
  const result: {
    'bindmousedown'?: (e: MouseEvent) => void
    'bindtouchstart'?: (e: TouchEvent) => void
    'bindmousemove'?: (e: MouseEvent) => void
    'bindtouchmove'?: (e: TouchEvent) => void
    'bindmouseup'?: (e: MouseEvent) => void
    'bindtouchend'?: (e: TouchEvent) => void
    'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void
    'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void
    'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void
    'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void
    'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void
    'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void
  } = {}

  if (onPointerDown) {
    result.bindmousedown = (event: MouseEvent) => {
      onPointerDown(unifyPointerEvent(event, 'pointerdown'))
    }
    result.bindtouchstart = (event: TouchEvent) => {
      onPointerDown(unifyPointerEvent(event, 'pointerdown'))
    }
  }

  if (onPointerMove) {
    result.bindmousemove = (event: MouseEvent) => {
      onPointerMove(unifyPointerEvent(event, 'pointermove'))
    }
    result.bindtouchmove = (event: TouchEvent) => {
      onPointerMove(unifyPointerEvent(event, 'pointermove'))
    }
  }

  if (onPointerUp) {
    result.bindmouseup = (event: MouseEvent) => {
      onPointerUp(unifyPointerEvent(event, 'pointerup'))
    }
    result.bindtouchend = (event: TouchEvent) => {
      onPointerUp(unifyPointerEvent(event, 'pointerup'))
    }
  }

  if (onPointerDownMT) {
    result['main-thread:bindmousedown'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onPointerDownMT(unifyPointerEventMT(event, 'pointerdown'))
    }
    result['main-thread:bindtouchstart'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onPointerDownMT(unifyPointerEventMT(event, 'pointerdown'))
    }
  }

  if (onPointerMoveMT) {
    result['main-thread:bindmousemove'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onPointerMoveMT(unifyPointerEventMT(event, 'pointermove'))
    }
    result['main-thread:bindtouchmove'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onPointerMoveMT(unifyPointerEventMT(event, 'pointermove'))
    }
  }

  if (onPointerUpMT) {
    result['main-thread:bindmouseup'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onPointerUpMT(unifyPointerEventMT(event, 'pointerup'))
    }
    result['main-thread:bindtouchend'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onPointerUpMT(unifyPointerEventMT(event, 'pointerup'))
    }
  }

  return result
}

export default usePointerEvent
export type { CustomPointerEvent, CustomPointerEventMT }
