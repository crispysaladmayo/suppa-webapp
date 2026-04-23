import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getApiOrigin } from '../api/apiBase.js';
import { api } from '../api/client.js';
import { loadApiConfigForApp } from '../config/publicConfig.js';
import type { z } from 'zod';
import { UserSchema } from '../api/schemas.js';
import { log } from '../logger.js';

type User = z.infer<typeof UserSchema>;

export type ApiReachableHint = 'unknown' | 'ok' | 'unreachable';

type AuthCtx = {
  user: User | null;
  busy: boolean;
  /** Set after first session check: API probably not running if `unreachable`. */
  apiReachable: ApiReachableHint;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, householdName?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function looksLikeApiDown(msg: string): boolean {
  return /non-JSON|3001|ECONNREFUSED|Failed to fetch|NetworkError|fetch failed|Load failed|502|503|504|AbortError|aborted|timed out|404/i.test(
    msg,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(true);
  const [apiReachable, setApiReachable] = useState<ApiReachableHint>('unknown');

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const me = await api.me();
      setUser(me.user);
      setApiReachable('ok');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log.error('auth_refresh_failed', { err: msg });
      setUser(null);
      setApiReachable(looksLikeApiDown(msg) ? 'unreachable' : 'unknown');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      await loadApiConfigForApp();
      if (cancel) return;
      const hasRemoteApi = Boolean(getApiOrigin());
      const staticPagesNoApi = import.meta.env.VITE_GITHUB_PAGES === '1' && !hasRemoteApi;
      if (staticPagesNoApi) {
        setUser(null);
        setApiReachable('unreachable');
        setBusy(false);
        return;
      }
      await refresh();
    })();
    return () => {
      cancel = true;
    };
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setApiReachable('ok');
  }, []);

  const register = useCallback(
    async (email: string, password: string, householdName?: string) => {
      await api.register(email, password, householdName);
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, busy, apiReachable, refresh, login, register, logout }),
    [user, busy, apiReachable, refresh, login, register, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider missing');
  return v;
}
