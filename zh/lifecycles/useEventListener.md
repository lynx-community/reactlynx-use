# useEventListener

用于尽早添加全局事件监听器的 Hook。

## 示例

```tsx
import { useEventListener } from "@lynx-js/react-use";

const App = () => {
  // 监听 'exposure' (曝光) 事件
  useEventListener('exposure', (e) => {
    console.log("exposure", e);
  });

  // 监听 'disexposure' (反曝光/消失) 事件
  useEventListener('disexposure', (e) => {
    console.log("disexposure", e);
  });

  return (
    <view
      style={{ width: '100px', height: '100px', backgroundColor: 'red' }}
      exposure-id='a'
    />
  );
};
```

## 类型定义

```ts
declare const useEventListener: (
  eventName: string,
  listener: (...args: any[]) => void
) => void;
```
