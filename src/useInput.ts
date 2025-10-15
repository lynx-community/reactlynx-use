import { useCallback, useState } from '@lynx-js/react';
import type { BaseEvent } from '@lynx-js/types';

export type InputInputEvent = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  isComposing?: boolean;
};

export type InputEvent = BaseEvent<'bindinput', InputInputEvent>;

export type UseInputOptions<T = string> = {
  onChange?:
    | (() => void)
    | ((value: T) => void)
    | ((value: T, event: InputEvent) => void);
  validator?:
    | (() => boolean)
    | ((value: T) => boolean)
    | ((value: T, event: InputEvent) => boolean);
  formatter?:
    | (() => T)
    | ((value: T) => T)
    | ((value: T, event: InputEvent) => T);
};

function useInput<T = string>(initialValue: T, options?: UseInputOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleInput = useCallback(
    (e: InputEvent) => {
      const inputValue = e.detail.value as T;

      const formattedValue = options?.formatter
        ? options.formatter(inputValue, e)
        : inputValue;

      if (options?.validator) {
        if (!options.validator(formattedValue, e)) {
          return;
        }
      }

      setValue(formattedValue);

      if (options?.onChange) {
        options.onChange(formattedValue, e);
      }
    },
    [options],
  );

  const clear = useCallback(() => {
    setValue('' as T);
  }, []);

  return {
    value,
    reset,
    clear,
    handleInput,
  };
}

export default useInput;
