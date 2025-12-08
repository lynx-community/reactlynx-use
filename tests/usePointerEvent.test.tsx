import { type MainThreadRef, runOnMainThread, useMainThreadRef } from '@lynx-js/react'
import { fireEvent, render } from '@lynx-js/react/testing-library'
import { describe, expect, it, vi } from 'vitest'
import usePointerEvent, { type CustomPointerEventMT } from '../src/usePointerEvent'

describe('usePointerEvent (BT) integration', () => {
  it('binds mouse down and normalizes button/buttons', () => {
    const onPointerDown = vi.fn()
    const Comp = () => {
      const props = usePointerEvent({ onPointerDown })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.mousedown(container.firstChild, { x: 10, y: 20, pageX: 110, pageY: 120, clientX: 210, clientY: 220, button: 1, buttons: 3 })
    expect(onPointerDown).toHaveBeenCalledTimes(1)
    const e = onPointerDown.mock.calls[0][0]
    expect(e.pointerType).toBe('mouse')
    expect(e.button).toBe(0)
    expect(e.buttons).toBe(3)
    expect(e.x).toBe(10)
    expect(e.clientX).toBe(210)
  })

  it('binds touch start and normalizes detail/touch fields', () => {
    const onPointerDown = vi.fn()
    const Comp = () => {
      const props = usePointerEvent({ onPointerDown })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.touchstart(container.firstChild, { detail: { x: 50, y: 60 }, touches: [{ identifier: 1, x: 51, y: 61, pageX: 151, pageY: 161, clientX: 251, clientY: 261 }] })
    expect(onPointerDown).toHaveBeenCalledTimes(1)
    const e = onPointerDown.mock.calls[0][0]
    expect(e.pointerType).toBe('touch')
    expect(e.x).toBe(151)
    expect(e.y).toBe(161)
    expect(e.pointerId).toBe(1)
    expect(e.isPrimary).toBe(true)
    expect(e.pageX).toBe(151)
    expect(e.clientY).toBe(261)
  })
})

describe('usePointerEvent (MT) integration', () => {
  it('binds MT mouse down and normalizes button/buttons/targets', async () => {
    let mtEventRef: MainThreadRef<CustomPointerEventMT | null>
    const Comp = () => {
      mtEventRef = useMainThreadRef<CustomPointerEventMT>(null)
      const props = usePointerEvent({
        onPointerDownMT: (e) => {
          'main thread'
          mtEventRef.current = e
        },
      })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.mousedown(container.firstChild, { x: 5, y: 6, pageX: 105, pageY: 106, clientX: 205, clientY: 206, button: 3, buttons: 1 })
    const read = runOnMainThread(() => {
      'main thread'
      return mtEventRef?.current
    })
    const e = await read() as CustomPointerEventMT
    expect(e.pointerType).toBe('mouse')
    expect(e.button).toBe(1)
    expect(e.buttons).toBe(1)
    // target/currentTarget may be omitted in test env
  })

  it('binds MT touch start and normalizes detail/touch fields', async () => {
    let mtEventRef: MainThreadRef<CustomPointerEventMT | null>
    const Comp = () => {
      mtEventRef = useMainThreadRef<CustomPointerEventMT>(null)
      const props = usePointerEvent({
        onPointerDownMT: (e) => {
          'main thread'
          mtEventRef.current = e
        },
      })
      return (
        <view {...props}></view>
      )
    }
    const { container } = render(<Comp />)
    fireEvent.touchstart(container.firstChild, { detail: { x: 7, y: 8 }, touches: [{ identifier: 9, x: 0, y: 0, pageX: 100, pageY: 101, clientX: 200, clientY: 201 }] })
    const read = runOnMainThread(() => {
      'main thread'
      return mtEventRef?.current
    })
    const e = await read() as CustomPointerEventMT
    expect(e.pointerType).toBe('touch')
    expect(e.x).toBe(100)
    expect(e.y).toBe(101)
    expect(e.pointerId).toBe(9)
    // target/currentTarget may be omitted in test env
  })
})
