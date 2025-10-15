// biome-ignore-all lint/suspicious/noExplicitAny: need any here

export function backgroundOnlyFactory<T extends (...args: any[]) => any>(
  hook: T,
): T {
  return ((...args: any[]) => {
    'background only';
    return hook(...args);
  }) as T;
}
