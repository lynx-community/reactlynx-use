import { useState } from '@lynx-js/react';
import { nanoid } from 'nanoid';

export default function useUniqueId(prefix: string = ''): string {
  const [id] = useState(() => `${prefix}${nanoid()}`);
  return id;
}
