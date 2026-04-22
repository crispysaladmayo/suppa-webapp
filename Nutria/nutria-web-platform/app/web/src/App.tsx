import { AuthProvider, useAuth } from './auth/AuthContext.js';
import { AppShell } from './pages/AppShell.js';
import { LoginPage } from './pages/LoginPage.js';

function Gate() {
  const { user, busy } = useAuth();
  if (busy) {
    return (
      <div className="app-shell">
        <p style={{ color: 'var(--muted)' }}>Memuat sesi…</p>
      </div>
    );
  }
  if (!user) return <LoginPage />;
  return <AppShell />;
}

export function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
