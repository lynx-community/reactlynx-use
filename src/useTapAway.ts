// biome-ignore-all lint/suspicious/noExplicitAny: need any here for Lynx node/target shapes
import type { RefObject } from "@lynx-js/react";
import { useEffect, useMemo, useRef } from "@lynx-js/react";

const GLOBAL_EVENT_ATTR = "trigger-global-event";

export type TapAwayEvent = {
  target?: unknown;
};

type TapAwayRef = RefObject<unknown> | Array<RefObject<unknown>>;

const getUid = (node: any): string | null => {
  if (node == null || typeof node !== "object") return null;
  const value = node.uid;
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : null;
};

const getPathNodes = (value: unknown): Array<Record<string, unknown>> | null => {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object"),
    );
  }
  return null;
};

type ComparablePathNode = {
  tag: string;
  id: string;
  index: number | "";
  classList: string[];
  dataSetEntries: Array<[string, string]>;
};

const toComparablePathNode = (node: Record<string, unknown>): ComparablePathNode => {
  const tag = String(node.tag ?? "");
  const id = String(node.id ?? "");
  const index = typeof node.index === "number" ? node.index : "";
  const classList = Array.isArray(node.class)
    ? node.class.map((item) => String(item))
    : [];
  const dataSet = node.dataSet as Record<string, unknown> | undefined;
  const dataSetEntries = dataSet
    ? Object.entries(dataSet)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)] as [string, string])
    : [];
  return { tag, id, index, classList, dataSetEntries };
};

const isSamePathNode = (
  left: ComparablePathNode,
  right: ComparablePathNode,
): boolean => {
  if (left.tag !== right.tag) return false;
  if (left.id !== right.id) return false;
  if (left.index !== right.index) return false;
  if (left.classList.length !== right.classList.length) return false;
  for (let i = 0; i < left.classList.length; i += 1) {
    if (left.classList[i] !== right.classList[i]) return false;
  }
  if (left.dataSetEntries.length !== right.dataSetEntries.length) return false;
  for (let i = 0; i < left.dataSetEntries.length; i += 1) {
    if (left.dataSetEntries[i][0] !== right.dataSetEntries[i][0]) return false;
    if (left.dataSetEntries[i][1] !== right.dataSetEntries[i][1]) return false;
  }
  return true;
};

const getComparablePathNodes = (value: unknown): ComparablePathNode[] | null => {
  const nodes = getPathNodes(value);
  if (!nodes?.length) return null;
  const comparableNodes = nodes.map((node) => toComparablePathNode(node));
  return comparableNodes.length ? comparableNodes : null;
};

const isPathSuffix = (target: ComparablePathNode[], ref: ComparablePathNode[]): boolean => {
  if (!target.length || !ref.length || target.length < ref.length) return false;
  const offset = target.length - ref.length;
  for (let i = 0; i < ref.length; i += 1) {
    if (!isSamePathNode(target[offset + i], ref[i])) return false;
  }
  return true;
};

const ensureGlobalTapEvents = () => {
  const query = lynx?.createSelectorQuery?.();
  if (!query) return;
  try {
    const selector =
      typeof (query as { selectRoot?: () => unknown }).selectRoot === "function"
        ? (query as { selectRoot: () => any }).selectRoot()
        : null;
    if (!selector?.setNativeProps) return;
    const result = selector.setNativeProps({ [GLOBAL_EVENT_ATTR]: true });
    result?.exec?.();
  } catch {
    // noop: best-effort to enable global event forwarding
  }
};

const useTapAway = <E extends TapAwayEvent = TapAwayEvent>(
  ref: TapAwayRef,
  onTapAway: (event: E) => void,
  eventName: "tap" = "tap",
): void => {
  "background only";

  const callbackRef = useRef(onTapAway);
  const refs = useMemo(() => (Array.isArray(ref) ? ref : [ref]), [ref]);
  const aliveRef = useRef(true);

  const refPathNodesRef = useRef(
    new WeakMap<RefObject<unknown>, ComparablePathNode[]>(),
  );
  const refPathRequestedRef = useRef(new WeakSet<RefObject<unknown>>());

  const resolveRefPathKeys = (refItem: RefObject<unknown>) => {
    if (refPathNodesRef.current.has(refItem)) return;
    if (refPathRequestedRef.current.has(refItem)) return;

    const node = refItem?.current as any;
    if (!node || typeof node.path !== "function") return;

    refPathRequestedRef.current.add(refItem);
    try {
      node
        .path((data: unknown) => {
          const comparableNodes = getComparablePathNodes(data);
          if (comparableNodes?.length) {
            refPathNodesRef.current.set(refItem, comparableNodes);
            return;
          }
          refPathRequestedRef.current.delete(refItem);
        })
        ?.exec?.();
    } catch {
      refPathRequestedRef.current.delete(refItem);
      // ignore
    }
  };

  const isInsideByPath = (pathValue: unknown): boolean => {
    const pathNodes = getComparablePathNodes(pathValue);
    if (!pathNodes?.length) return false;

    return refs.some((refItem) => {
      if (!refItem) return false;
      const refNodes = refPathNodesRef.current.get(refItem);
      if (!refNodes?.length) {
        resolveRefPathKeys(refItem);
        return false;
      }
      return isPathSuffix(pathNodes, refNodes);
    });
  };

  useEffect(() => {
    callbackRef.current = onTapAway;
  }, [onTapAway]);

  useEffect(() => {
    aliveRef.current = true;

    ensureGlobalTapEvents();

    refs.forEach((refItem) => {
      if (!refItem) return;
      resolveRefPathKeys(refItem);
    });

    const emitter = lynx?.getJSModule?.("GlobalEventEmitter");
    if (!emitter || !refs.length) {
      return () => {
        aliveRef.current = false;
      };
    }

    const handler = (event: unknown) => {
      const e = event as TapAwayEvent;
      const target = e.target;
      if (!target) {
        callbackRef.current?.(event as E);
        return;
      }

      const targetUid = getUid(target);
      const insideByTarget = refs.some((refItem) => {
        const node = refItem?.current as any;
        if (!node) return false;
        if (node === target) return true;
        const refUid = getUid(node);
        if (targetUid && refUid && targetUid === refUid) return true;
        return false;
      });
      if (insideByTarget) return;

      if (targetUid) {
        try {
          const query = lynx?.createSelectorQuery?.();
          if (query) {
            const selector = (query as any).selectUniqueID(targetUid);
            selector
              ?.path((data: unknown) => {
                if (!aliveRef.current) return;
                if (isInsideByPath(data)) return;
                callbackRef.current?.(event as E);
              })
              ?.exec?.();
            return;
          }
        } catch {
          // ignore and fallback to outside
        }
      }

      callbackRef.current?.(event as E);
    };

    emitter?.addListener?.(eventName, handler);

    return () => {
      aliveRef.current = false;
      emitter?.removeListener?.(eventName, handler);
    };
  }, [refs, eventName]);
};

export default useTapAway;
