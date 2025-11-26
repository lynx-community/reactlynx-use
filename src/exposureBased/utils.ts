// Generic admission gating utilities used by exposure and intersection

type GateState = {
  visible: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

const createKeyedAdmissionGate = <E, I>(
  admissionTimeMs: number,
  getKey: (item: I) => string | null
) => {
  const map = new Map<string, GateState>();

  const ensure = (key: string): GateState => {
    const state = map.get(key);
    if (state) return state;
    const next: GateState = { visible: false, timer: null };
    map.set(key, next);
    return next;
  };

  const clearTimer = (state: GateState) => {
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
  };

  const appear = (e: E, item: I, cb: (e: E, info: I) => void) => {
    const key = getKey(item);
    if (!key) return;
    const state = ensure(key);
    if (state.visible || state.timer) return;
    if (admissionTimeMs <= 0) {
      state.visible = true;
      cb(e, item);
      return;
    }
    state.timer = setTimeout(() => {
      state.timer = null;
      if (!state.visible) {
        state.visible = true;
        cb(e, item);
      }
    }, admissionTimeMs);
  };

  const disappear = (e: E, item: I, cb: (e: E, info: I) => void) => {
    const key = getKey(item);
    if (!key) return;
    const state = ensure(key);
    if (state.timer) {
      clearTimer(state);
      return;
    }
    if (state.visible) {
      state.visible = false;
      cb(e, item);
    }
  };

  const isVisible = (key: string) => map.get(key)?.visible === true;

  const dispose = () => {
    map.forEach((state) => {
      clearTimer(state);
    });
    map.clear();
  };

  return { appear, disappear, isVisible, dispose };
};

// Single-node admission gate (generic over event type E)
export function createAdmissionGate<E = never>(admissionTimeMs: number = 0) {
  const SINGLE_KEY = "__single__";
  const gate = createKeyedAdmissionGate<E, string>(
    admissionTimeMs,
    (key) => key
  );

  return {
    appear(e: E, cb: { onAdmit: (e: E) => void }) {
      gate.appear(e, SINGLE_KEY, (event, _key) => cb.onAdmit(event));
    },
    disappear(e: E, cb: { onLeave: (e: E) => void }) {
      gate.disappear(e, SINGLE_KEY, (event, _key) => cb.onLeave(event));
    },
    isVisible() {
      return gate.isVisible(SINGLE_KEY);
    },
    dispose() {
      gate.dispose();
    },
  };
}

// Multi-node admission gate keyed by id (generic over event type E and item info I)
export function createMultiAdmissionGate<
  E = never,
  I extends { id?: string; scene?: string } = { id?: string; scene?: string }
>(admissionTimeMs: number = 0) {
  const gate = createKeyedAdmissionGate<E, I>(
    admissionTimeMs,
    (item) => item.id ?? null
  );

  return {
    appear(e: E, item: I, cb: { onAdmit: (e: E, info: I) => void }) {
      gate.appear(e, item, cb.onAdmit);
    },
    disappear(e: E, item: I, cb: { onLeave: (e: E, info: I) => void }) {
      gate.disappear(e, item, cb.onLeave);
    },
    isVisible(id: string) {
      return gate.isVisible(id);
    },
    dispose() {
      gate.dispose();
    },
  };
}
