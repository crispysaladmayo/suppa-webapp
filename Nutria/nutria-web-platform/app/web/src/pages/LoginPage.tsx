import { FormEvent, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@nutria.local');
  const [password, setPassword] = useState('nutria-demo-12');
  const [householdName, setHouseholdName] = useState('Rumah kami');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, householdName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell" style={{ maxWidth: 440 }}>
      <p className="eyebrow" style={{ textAlign: 'center' }}>
        Nutria
      </p>
      <div className="login-card">
        <h1 className="screen-title" style={{ fontSize: '1.85rem' }}>
          Selamat datang
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          Masuk untuk menyinkronkan stok prep, rencana, dan belanja.
        </p>
        <div className="login-toggle">
          <button type="button" data-on={mode === 'login'} onClick={() => setMode('login')}>
            Masuk
          </button>
          <button type="button" data-on={mode === 'register'} onClick={() => setMode('register')}>
            Daftar
          </button>
        </div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          <label>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Email</div>
            <input
              className="input"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Kata sandi</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>
          {mode === 'register' ? (
            <label>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>
                Nama rumah tangga
              </div>
              <input
                className="input"
                value={householdName}
                onChange={(ev) => setHouseholdName(ev.target.value)}
              />
            </label>
          ) : null}
          {error ? (
            <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</div>
          ) : null}
          <button className="btn-primary" type="submit" disabled={loading}>
            {mode === 'login' ? 'Masuk' : 'Buat akun'}
          </button>
        </form>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.45 }}>
          Demo lokal: jalankan seed server lalu gunakan akun contoh di dokumentasi platform.
        </p>
      </div>
    </div>
  );
}
