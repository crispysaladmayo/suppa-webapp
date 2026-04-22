import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { dayFullName, headerDayMonth } from '../lib/formatId.js';
import { log } from '../logger.js';

const ING_ICON = ['🍗', '🥚', '🍠', '🌽'];

export function Prep() {
  const [sessions, setSessions] = useState<Array<Record<string, unknown>>>([]);
  const [ingredients, setIngredients] = useState<Array<Record<string, unknown>>>([]);
  const [steps, setSteps] = useState<Array<Record<string, unknown>>>([]);
  const [ingName, setIngName] = useState('Dada ayam');
  const [ingKg, setIngKg] = useState('5.6');
  const [ingShrink, setIngShrink] = useState('25');
  const [stepTitle, setStepTitle] = useState('Siapkan bahan');
  const [notes, setNotes] = useState('Prep hari Minggu');
  const [error, setError] = useState<string | null>(null);

  const active = useMemo(
    () => sessions.find((s) => !s.endedAt) ?? null,
    [sessions],
  );
  const activeId = active ? String(active.id) : null;

  async function loadSessions() {
    try {
      const s = await api.prepSessions();
      setSessions(s.sessions);
    } catch (e) {
      log.error('prep_load_failed', { err: String(e) });
      setError('Gagal memuat sesi');
    }
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  useEffect(() => {
    async function loadDetail() {
      if (!activeId) {
        setIngredients([]);
        setSteps([]);
        return;
      }
      try {
        const [ing, st] = await Promise.all([
          api.prepSessionIngredients(activeId),
          api.prepSessionSteps(activeId),
        ]);
        setIngredients(ing.ingredients);
        setSteps(st.steps);
      } catch (e) {
        log.error('prep_detail_failed', { err: String(e) });
      }
    }
    void loadDetail();
  }, [activeId]);

  const estPortions = useMemo(() => {
    const sumKg = ingredients.reduce((a, x) => a + (Number(x.rawKg) || 0), 0);
    if (sumKg <= 0) return 14;
    return Math.max(4, Math.round(sumKg / 0.4));
  }, [ingredients]);

  async function startSession(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createPrepSession({ notes });
      setNotes('Prep hari Minggu');
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mulai');
    }
  }

  async function endSession(id: string) {
    setError(null);
    try {
      await api.patchPrepSession(id, { endedAt: new Date().toISOString() });
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengakhiri');
    }
  }

  async function addIngredient(e: FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    setError(null);
    try {
      const rawKg = Number(ingKg);
      const shrinkPct = Number(ingShrink);
      if (!ingName.trim() || !Number.isFinite(rawKg) || !Number.isFinite(shrinkPct)) {
        setError('Isi nama dan angka bahan');
        return;
      }
      await api.addPrepSessionIngredient(activeId, {
        name: ingName.trim(),
        rawKg,
        shrinkPct,
        sortOrder: ingredients.length,
      });
      setIngName('Dada ayam');
      setIngKg('5.6');
      setIngShrink('25');
      const ing = await api.prepSessionIngredients(activeId);
      setIngredients(ing.ingredients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah bahan');
    }
  }

  async function addStep(e: FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    setError(null);
    try {
      if (!stepTitle.trim()) return;
      await api.addPrepSessionStep(activeId, { title: stepTitle.trim(), sortOrder: steps.length });
      setStepTitle('Rebus ubi madu');
      const st = await api.prepSessionSteps(activeId);
      setSteps(st.steps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah langkah');
    }
  }

  const clock =
    active && typeof active.startedAt === 'string'
      ? String(active.startedAt).slice(11, 16)
      : '--:--';
  const dow = dayFullName(new Date().getDay());

  return (
    <div>
      <p className="eyebrow">
        {headerDayMonth()} · {clock}
      </p>
      <h2 className="screen-title">Prep hari {dow}</h2>

      {error ? (
        <p style={{ color: 'var(--danger)', fontSize: '0.88rem', marginTop: 8 }}>{error}</p>
      ) : null}

      {!active ? (
        <div className="hifi-card" style={{ marginTop: 14 }}>
          <h3 className="h-serif" style={{ fontSize: '1.1rem' }}>
            Mulai sesi
          </h3>
          <form onSubmit={startSession} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <input className="input" value={notes} onChange={(ev) => setNotes(ev.target.value)} />
            <button className="btn-primary" type="submit">
              Mulai sesi prep
            </button>
          </form>
        </div>
      ) : (
        <>
          <div
            style={{
              marginTop: 14,
              borderRadius: 'var(--radius-lg)',
              padding: '20px 18px 18px',
              background: 'linear-gradient(135deg, var(--prep-gold-1), var(--prep-gold-2))',
              color: 'var(--prep-card-text)',
              boxShadow: '0 12px 32px rgba(212, 149, 71, 0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p className="eyebrow" style={{ color: 'rgba(46,40,36,0.65)' }}>
                  Total waktu
                </p>
                <div className="h-serif" style={{ fontSize: '1.65rem' }}>
                  2j 30m
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 4 }}>
                  {clock} – selesai estimasi
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="eyebrow" style={{ color: 'rgba(46,40,36,0.65)' }}>
                  Hasil
                </p>
                <div className="h-serif" style={{ fontSize: '1.65rem' }}>
                  {estPortions}
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 4 }}>
                  porsi makan · 7 hari
                </div>
              </div>
            </div>
            <div className="progress-track" style={{ marginTop: 18, background: 'rgba(46,40,36,0.15)' }}>
              <div className="progress-fill" style={{ width: '12%', background: 'var(--accent)' }} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                marginTop: 8,
                opacity: 0.9,
              }}
            >
              <span>0% selesai</span>
              <span>0/150 mnt</span>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginTop: 14, width: '100%', background: 'rgba(255,255,255,0.35)' }}
              onClick={() => void endSession(activeId!)}
            >
              Akhiri sesi
            </button>
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="h-serif" style={{ fontSize: '1.2rem' }}>
                Bahan utama
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>7 hari · 2 orang</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: 12,
              }}
            >
              {ingredients.slice(0, 4).map((ing, i) => {
                const cooked = (Number(ing.rawKg) || 0) * (1 - (Number(ing.shrinkPct) || 0) / 100);
                return (
                  <div key={String(ing.id)} className="hifi-card" style={{ padding: '14px 12px' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 8 }}>{ING_ICON[i % ING_ICON.length]}</div>
                    <div className="eyebrow" style={{ fontSize: '0.62rem' }}>
                      {String(ing.name).slice(0, 12).toUpperCase()}
                    </div>
                    <div className="h-serif" style={{ fontSize: '1.05rem', marginTop: 6 }}>
                      {Number(ing.rawKg).toFixed(1)} kg
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.35 }}>
                      → {cooked.toFixed(1)}kg matang (susut {Number(ing.shrinkPct)}%)
                    </div>
                  </div>
                );
              })}
              {ingredients.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Tambah bahan di bawah — grid mengikuti 4 item pertama.
                </p>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="h-serif" style={{ fontSize: '1.2rem' }}>
                Urutan masak
              </h3>
              <span
                className="tag-prep"
                style={{ fontSize: '0.62rem', background: 'rgba(212,149,71,0.25)', color: '#5c4f3d' }}
              >
                paralel · pintar
              </span>
            </div>
            <div className="hifi-card" style={{ marginTop: 12, padding: '8px 0' }}>
              {steps.length === 0 ? (
                <p style={{ padding: '12px 16px', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Belum ada langkah — tambah di bawah.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {steps.map((st, idx) => (
                    <li
                      key={String(st.id)}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border-soft)',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          border: '2px solid var(--border)',
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {clock} · {15 + idx * 15} mnt
                        </div>
                        <div className="h-serif" style={{ fontSize: '1.02rem', marginTop: 4 }}>
                          {String(st.title)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form onSubmit={addStep} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                className="input"
                value={stepTitle}
                onChange={(ev) => setStepTitle(ev.target.value)}
                placeholder="Judul langkah"
                style={{ flex: 1 }}
              />
              <button className="btn-primary" type="submit" style={{ width: 'auto', padding: '12px 18px' }}>
                +
              </button>
            </form>
          </div>

          <div className="hifi-card" style={{ marginTop: 18 }}>
            <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
              Tambah bahan
            </h3>
            <form onSubmit={addIngredient} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              <input className="input" value={ingName} onChange={(ev) => setIngName(ev.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input className="input" value={ingKg} onChange={(ev) => setIngKg(ev.target.value)} placeholder="kg" />
                <input
                  className="input"
                  value={ingShrink}
                  onChange={(ev) => setIngShrink(ev.target.value)}
                  placeholder="% susut"
                />
              </div>
              <button className="btn-primary" type="submit">
                Tambah ke sesi
              </button>
            </form>
          </div>
        </>
      )}

      {sessions.filter((s) => s.endedAt).length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <p className="eyebrow">Riwayat</p>
          {sessions
            .filter((s) => s.endedAt)
            .map((s) => (
              <div key={String(s.id)} className="hifi-card" style={{ marginTop: 8, padding: '12px 14px' }}>
                <span className="tag-prep">Selesai</span>
                <div style={{ marginTop: 6, fontSize: '0.88rem' }}>{String(s.notes ?? 'Sesi')}</div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}
