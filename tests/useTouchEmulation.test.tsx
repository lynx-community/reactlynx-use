import { type MainThreadRef, runOnMainThread, useMainThreadRef } from '@lynx-js/react'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import type { MainThread } from '@lynx-js/types'
import { describe, expect, it, vi } from 'vitest'
import useTouchEmulation from '../src/useTouchEmulation'

describe('useTouchEmulation (BT) integration', () => {
  it('synthesizes touch from mouse down', () => {
    const onTouchStart = vi.fn()
    const Comp = () => {
      const props = useTouchEmulation({ onTouchStart })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.mousedown(container.firstChild, { x: 10, y: 20, pageX: 110, pageY: 120, clientX: 210, clientY: 220 })
    expect(onTouchStart).toHaveBeenCalledTimes(1)
    const e = onTouchStart.mock.calls[0][0] as unknown as TouchEvent
    // synthesized touch event fields
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(110)
    // @ts-expect-error test environment type narrowing
    expect(e.detail.y).toBe(120)
    expect(e.touches.length).toBe(1)
    expect(e.changedTouches.length).toBe(1)
    expect(e.touches[0].clientX).toBe(210)
    expect(e.touches[0].pageY).toBe(120)
  })

  it('passes through native touch start', () => {
    const onTouchStart = vi.fn()
    const Comp = () => {
      const props = useTouchEmulation({ onTouchStart })

      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.touchstart(container.firstChild, { detail: { x: 50, y: 60 }, touches: [{ identifier: 2, x: 0, y: 0, pageX: 151, pageY: 161, clientX: 251, clientY: 261 }] })
    expect(onTouchStart).toHaveBeenCalledTimes(1)
    const e = onTouchStart.mock.calls[0][0] as unknown as TouchEvent
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(50)
    expect(e.touches[0].identifier).toBe(2)
    expect(e.touches[0].clientY).toBe(261)
  })

  it('synthesizes touchend from mouseup with empty touches', () => {
    const onTouchEnd = vi.fn()
    const Comp = () => {
      const props = useTouchEmulation({ onTouchEnd })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.mouseup(container.firstChild, { x: 1, y: 2, pageX: 101, pageY: 102, clientX: 201, clientY: 202 })
    expect(onTouchEnd).toHaveBeenCalledTimes(1)
    const e = onTouchEnd.mock.calls[0][0] as unknown as TouchEvent
    // @ts-expect-error test environment type narrowing
    expect(e.detail.x).toBe(101)
    expect(e.touches.length).toBe(0)
    expect(e.changedTouches.length).toBe(1)
  })
})

describe('useTouchEmulation (MT) integration', () => {
  it('synthesizes MT touch from mouse down', async () => {
    let mtEventRef: MainThreadRef<MainThread.TouchEvent | null>
    const Comp = () => {
      mtEventRef = useMainThreadRef<MainThread.TouchEvent>(null)
      const props = useTouchEmulation({
        onTouchStartMT: (e) => {
          'main thread'
          mtEventRef.current = e
        },
      })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.mousedown(container.firstChild, { x: 15, y: 25, pageX: 115, pageY: 125, clientX: 215, clientY: 225 })
    const read = runOnMainThread(() => {
      'main thread'
      return mtEventRef?.current
    })
    const e = await read()
    // @ts-expect-error test environment type narrowing
    expect(e?.detail.x).toBe(115)
    // @ts-expect-error test environment type narrowing
    expect(e?.touches.length).toBe(1)
    // target/currentTarget may be omitted in test env
  })
})

describe('useTouchEmulation cancel behavior', () => {
  it('BT: touchend triggers onTouchCancel and overrides onTouchEnd when both provided', () => {
    const onTouchEnd = vi.fn()
    const onTouchCancel = vi.fn()
    const Comp = () => {
      const props = useTouchEmulation({ onTouchEnd, onTouchCancel })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.touchend(container.firstChild, { detail: { x: 5, y: 6 }, touches: [] })
    expect(onTouchCancel).toHaveBeenCalledTimes(1)
    expect(onTouchEnd).toHaveBeenCalledTimes(0)
  })

  it('MT: touchcancel triggers onTouchCancelMT when provided', async () => {
    let mtCalledRef: MainThreadRef<boolean>
    const Comp = () => {
      mtCalledRef = useMainThreadRef<boolean>(false)
      const props = useTouchEmulation({
        onTouchCancelMT: () => {
          'main thread'
          mtCalledRef.current = true
        },
      })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.touchcancel(container.firstChild, { detail: { x: 7, y: 8 }, touches: [] })
    const read = runOnMainThread(() => {
      'main thread'
      return mtCalledRef?.current
    })
    const called = await read()
    expect(called).toBe(true)
  })
})
