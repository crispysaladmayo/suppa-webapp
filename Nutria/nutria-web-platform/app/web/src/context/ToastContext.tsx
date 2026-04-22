import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { hapticNudge } from '../lib/haptics.js';

type ToastId = string;

export type ShowToastOptions = {
  /** Secondary action, e.g. undo */
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  durationMs?: number;
};

type ToastItem = {
  id: ToastId;
  message: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
};

type ToastContextValue = {
  showToast: (message: string, opts?: ShowToastOptions) => void;
};

const Ctx = createContext<ToastContextValue | null>(null);

const DEFAULT_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<ToastId, number>>(new Map());

  const remove = useCallback((id: ToastId) => {
    setItems((t) => t.filter((x) => x.id !== id));
    const tid = timers.current.get(id);
    if (tid != null) window.clearTimeout(tid);
    timers.current.delete(id);
  }, []);

  const showToast = useCallback(
    (message: string, opts?: ShowToastOptions) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const durationMs = opts?.durationMs ?? DEFAULT_MS;
      hapticNudge('light');
      setItems((t) => [
        ...t,
        {
          id,
          message,
          actionLabel: opts?.actionLabel,
          onAction: opts?.onAction,
        },
      ]);
      const tid = window.setTimeout(() => remove(id), durationMs);
      timers.current.set(id, tid);
    },
    [remove],
  );

  useEffect(
    () => () => {
      for (const tid of timers.current.values()) window.clearTimeout(tid);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-host" aria-live="polite" aria-relevant="additions text">
        {items.map((t) => (
          <div key={t.id} className="toast-item nutria-motion-raise" role="status">
            <p className="toast-item__text">{t.message}</p>
            {t.actionLabel && t.onAction ? (
              <button
                type="button"
                className="toast-item__action"
                onClick={() => {
                  void Promise.resolve(t.onAction!())
                    .then(() => hapticNudge('success'))
                    .finally(() => remove(t.id));
                }}
              >
                {t.actionLabel}
              </button>
            ) : null}
            <button type="button" className="toast-item__dismiss" onClick={() => remove(t.id)} aria-label="Tutup">
              ×
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast requires ToastProvider');
  return c;
}
