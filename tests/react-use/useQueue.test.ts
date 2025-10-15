// biome-ignore-all lint/suspicious/noExplicitAny: need any here

import { act, renderHook } from '@lynx-js/react/testing-library';
import { useQueue } from '../../src/react-use';

const setUp = (initialQueue?: any[]) =>
  renderHook(() => useQueue(initialQueue));

it('takes initial state', () => {
  const { result } = setUp([1, 2, 3]);
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('appends new member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.add(3);
  });
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('pops oldest member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.remove();
  });
  const { first, size } = result.current;
  expect(first).toEqual(2);
  expect(size).toEqual(1);
});
