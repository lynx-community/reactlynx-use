import {
  createMemo as _createMemo,
  useBoolean as _useBoolean,
  useCounter as _useCounter,
  useDebounce as _useDebounce,
  useDefault as _useDefault,
  useEffectOnce as _useEffectOnce,
  useError as _useError,
  useLatest as _useLatest,
  useLifecycles as _useLifecycles,
  useMap as _useMap,
  useMountedState as _useMountedState,
  useNumber as _useNumber,
  usePrevious as _usePrevious,
  useQueue as _useQueue,
  useSet as _useSet,
  useSetState as _useSetState,
  useThrottle as _useThrottle,
  useThrottleFn as _useThrottleFn,
  useToggle as _useToggle,
  useUnmount as _useUnmount,
  useUnmountPromise as _useUnmountPromise,
  useUpdateEffect as _useUpdateEffect,
} from 'react-use';
import { backgroundOnlyFactory as factory } from './backgroundOnlyFactory';
import {
  useExposureForNode as _useExposureForNode,
  useExposureForPage as _useExposureForPage,
  useStayTime as _useStayTime,
} from './exposureBased';

export const createMemo = factory(_createMemo);
export const useBoolean = factory(_useBoolean);
export const useCounter = factory(_useCounter);
export const useDebounce = factory(_useDebounce);
export const useDefault = factory(_useDefault);
export const useEffectOnce = factory(_useEffectOnce);
export const useError = factory(_useError);
export const useLatest = factory(_useLatest);
export const useLifecycles = factory(_useLifecycles);
export const useMap = factory(_useMap);
export const useMountedState = factory(_useMountedState);
export const useNumber = factory(_useNumber);
export const usePrevious = factory(_usePrevious);
export const useQueue = factory(_useQueue);
export const useSet = factory(_useSet);
export const useSetState = factory(_useSetState);
export const useThrottle = factory(_useThrottle);
export const useThrottleFn = factory(_useThrottleFn);
export const useToggle = factory(_useToggle);
export const useUnmount = factory(_useUnmount);
export const useUnmountPromise = factory(_useUnmountPromise);
export const useUpdateEffect = factory(_useUpdateEffect);
export const useExposureForNode = factory(_useExposureForNode);
export const useExposureForPage = factory(_useExposureForPage);
export const useStayTime = factory(_useStayTime);
