---
'@lynx-js/react-use': patch
---

Add `usePointerEvent` and `useTouchEmulation` to handle both `TouchEvent` and `MouseEvent`.

```tsx
import { usePointerEvent, CustomPointerEvent, CustomPointerEventMT } from '@lynx-js/react-use'

function App() {
  const pointerHandlers = usePointerEvent({
    onPointerDown: (event: CustomPointerEvent) => {
      console.log('Pointer down', event)
    },
    onPointerDownMT: (event: CustomPointerEventMT) => {
      'main thread'
      console.log('Pointer down on main thread', event)
    },
  })

  return <view {...pointerHandlers}></view>
}
```
