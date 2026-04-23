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
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    return (
      <div className="api-offline-banner api-offline-banner--prod" role="status">
        <p className="api-offline-banner__title">Mode tampilan</p>
        <p className="api-offline-banner__body">
          Versi di GitHub Pages hanya file statis: tidak ada server login di domain ini. Akun dan data
          butuh <strong>API Nutria</strong> (lokal atau hosting). Untuk mode lengkap, ikuti README — dari
          folder <code className="api-offline-banner__code">nutria-web-platform</code> jalankan{' '}
          <code className="api-offline-banner__code">npm run dev</code> di komputer sendiri.
        </p>
      </div>
    );
  }

  return (
    <div className="api-offline-banner" role="alert">
      <p className="api-offline-banner__title">Eits, servernya belum nyala</p>
      <p className="api-offline-banner__body">
        Nyalain API dulu (biasanya <strong>port 3001</strong>). Dari folder{' '}
        <code className="api-offline-banner__code">nutria-web-platform</code> jalankan{' '}
        <code className="api-offline-banner__code">npm run dev</code> (server + web sekaligus), atau{' '}
        <code className="api-offline-banner__code">npm run dev -w app/server</code> di satu terminal dan{' '}
        <code className="api-offline-banner__code">npm run dev -w app/web</code> di terminal lain.
      </p>
      <p className="api-offline-banner__body api-offline-banner__body--tight" style={{ marginTop: 8 }}>
        Kalau di terminal muncul <strong>EADDRINUSE</strong> / &quot;port 3001 already in use&quot;: tutup
        instansi lama, atau cek dengan <code className="api-offline-banner__code">lsof -i :3001</code> lalu{' '}
        <code className="api-offline-banner__code">kill &lt;pid&gt;</code>. Bisa juga pakai port lain:{' '}
        <code className="api-offline-banner__code">PORT=3002 npm run dev -w app/server</code> dan sejajarkan
        Vite: <code className="api-offline-banner__code">NUTRIA_API_PORT=3002 npm run dev -w app/web</code>.
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: 280, lineHeight: 1.5 }}>
          Menyiapkan akun dan profil rumah tangga agar jadwal, list belanja, dan stok tampil selaras.
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
