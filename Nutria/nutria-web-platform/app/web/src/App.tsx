import { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { AppShell } from './pages/AppShell.js';
import { DesignQAPage } from './pages/DesignQAPage.js';
import { LoginPage } from './pages/LoginPage.js';

function isDesignQaUrl(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('designqa') === '1';
}

function ApiOfflineBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="api-offline-banner" role="alert">
      <p className="api-offline-banner__title">Eits, servernya belum nyala</p>
      <p className="api-offline-banner__body">
        Kalau lagi coba di laptop sendiri, nyalain dulu API di <strong>port 3001</strong>. Dari folder{' '}
        <code className="api-offline-banner__code">nutria-web-platform</code>, jalankan{' '}
        <code className="api-offline-banner__code">npm run dev</code> biar server dan web jalan bareng.
        Atau pakai dua jendela terminal:{' '}
        <code className="api-offline-banner__code">npm run dev -w app/server</code> lalu{' '}
        <code className="api-offline-banner__code">npm run dev -w app/web</code>.
      </p>
      <button type="button" className="btn-primary api-offline-banner__retry" onClick={onRetry}>
        Udah nyala — coba lagi ya
      </button>
    </div>
  );
}

function Gate() {
  const { user, busy, apiReachable, refresh } = useAuth();
  if (busy) {
    return (
      <div className="app-shell app-boot">
        <div className="app-boot__pulse" aria-hidden />
        <p className="eyebrow" style={{ margin: 0, letterSpacing: '0.16em' }}>
          Nutria
        </p>
        <p className="screen-title" style={{ fontSize: '1.2rem' }}>
          Bentar ya…
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: 260, lineHeight: 1.5 }}>
          Lagi nyiapin akun dan profil keluarga kamu biar semuanya sinkron.
        </p>
      </div>
    );
  }
  if (!user) {
    return (
      <>
        {apiReachable === 'unreachable' ? (
          <ApiOfflineBanner onRetry={() => void refresh()} />
        ) : null}
        <LoginPage />
      </>
    );
  }
  return (
    <>
      {apiReachable === 'unreachable' ? (
        <ApiOfflineBanner onRetry={() => void refresh()} />
      ) : null}
      <AppShell />
    </>
  );
}

export function App() {
  const [designQa] = useState(isDesignQaUrl);
  if (designQa) {
    return (
      <ToastProvider>
        <DesignQAPage />
      </ToastProvider>
    );
  }
  return (
    <ToastProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ToastProvider>
  );
}
