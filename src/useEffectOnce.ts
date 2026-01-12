import { type EffectCallback, useEffect } from "@lynx-js/react";

const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, []);
};

export default useEffectOnce;
