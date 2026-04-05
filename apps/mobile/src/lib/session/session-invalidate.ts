type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeSessionInvalidated(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitSessionInvalidated(): void {
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      /* noop */
    }
  }
}
