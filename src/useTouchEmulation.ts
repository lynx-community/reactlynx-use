import type { MainThread, MouseEvent, Touch, TouchEvent } from '@lynx-js/types'

type TouchAction = 'touchstart' | 'touchmove' | 'touchend'

function toTouchEvent(
  event: MouseEvent | TouchEvent,
  type: TouchAction,
): TouchEvent {
  const isTouch = 'detail' in event
  if (isTouch) return event as TouchEvent
  const mouse = event as MouseEvent
  const touch = {
    identifier: 1,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
  } as unknown as Touch
  const touches = type === 'touchend' ? [] : [touch]
  const changedTouches = [touch]
  return {
    detail: { x: mouse.x, y: mouse.y },
    touches,
    changedTouches,
  } as unknown as TouchEvent
}

function toTouchEventMT(
  event: MainThread.MouseEvent | MainThread.TouchEvent,
  type: TouchAction,
): MainThread.TouchEvent {
  'main thread'
  const isTouch = 'detail' in event
  if (isTouch) return event as MainThread.TouchEvent
  const mouse = event as MainThread.MouseEvent
  const touch = {
    identifier: 1,
    pageX: mouse.pageX,
    pageY: mouse.pageY,
    clientX: mouse.clientX,
    clientY: mouse.clientY,
  } as unknown as Touch
  const touches = type === 'touchend' ? [] : [touch]
  const changedTouches = [touch]
  return {
    detail: { x: mouse.x, y: mouse.y },
    touches,
    changedTouches,
    target: mouse.target,
    currentTarget: mouse.currentTarget,
  } as unknown as MainThread.TouchEvent
}

function useTouchEmulation({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchStartMT,
  onTouchMoveMT,
  onTouchEndMT,
}: {
  onTouchStart?: (event: TouchEvent) => void
  onTouchMove?: (event: TouchEvent) => void
  onTouchEnd?: (event: TouchEvent) => void
  onTouchStartMT?: (event: MainThread.TouchEvent) => void
  onTouchMoveMT?: (event: MainThread.TouchEvent) => void
  onTouchEndMT?: (event: MainThread.TouchEvent) => void
}): {
  'bindtouchstart'?: (e: TouchEvent) => void
  'bindmousedown'?: (e: MouseEvent) => void
  'bindtouchmove'?: (e: TouchEvent) => void
  'bindmousemove'?: (e: MouseEvent) => void
  'bindtouchend'?: (e: TouchEvent) => void
  'bindmouseup'?: (e: MouseEvent) => void
  'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void
  'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void
  'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void
  'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void
  'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void
  'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void
} {
  const result: {
    'bindtouchstart'?: (e: TouchEvent) => void
    'bindmousedown'?: (e: MouseEvent) => void
    'bindtouchmove'?: (e: TouchEvent) => void
    'bindmousemove'?: (e: MouseEvent) => void
    'bindtouchend'?: (e: TouchEvent) => void
    'bindmouseup'?: (e: MouseEvent) => void
    'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void
    'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void
    'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void
    'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void
    'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void
    'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void
  } = {}

  if (onTouchStart) {
    result.bindtouchstart = (event: TouchEvent) => {
      onTouchStart(toTouchEvent(event, 'touchstart'))
    }
    result.bindmousedown = (event: MouseEvent) => {
      onTouchStart(toTouchEvent(event, 'touchstart'))
    }
  }

  if (onTouchMove) {
    result.bindtouchmove = (event: TouchEvent) => {
      onTouchMove(toTouchEvent(event, 'touchmove'))
    }
    result.bindmousemove = (event: MouseEvent) => {
      onTouchMove(toTouchEvent(event, 'touchmove'))
    }
  }

  if (onTouchEnd) {
    result.bindtouchend = (event: TouchEvent) => {
      onTouchEnd(toTouchEvent(event, 'touchend'))
    }
    result.bindmouseup = (event: MouseEvent) => {
      onTouchEnd(toTouchEvent(event, 'touchend'))
    }
  }

  if (onTouchStartMT) {
    result['main-thread:bindtouchstart'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onTouchStartMT(toTouchEventMT(event, 'touchstart'))
    }
    result['main-thread:bindmousedown'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onTouchStartMT(toTouchEventMT(event, 'touchstart'))
    }
  }

  if (onTouchMoveMT) {
    result['main-thread:bindtouchmove'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onTouchMoveMT(toTouchEventMT(event, 'touchmove'))
    }
    result['main-thread:bindmousemove'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onTouchMoveMT(toTouchEventMT(event, 'touchmove'))
    }
  }

  if (onTouchEndMT) {
    result['main-thread:bindtouchend'] = (event: MainThread.TouchEvent) => {
      'main thread'
      onTouchEndMT(toTouchEventMT(event, 'touchend'))
    }
    result['main-thread:bindmouseup'] = (event: MainThread.MouseEvent) => {
      'main thread'
      onTouchEndMT(toTouchEventMT(event, 'touchend'))
    }
  }

  return result
}

export default useTouchEmulation
