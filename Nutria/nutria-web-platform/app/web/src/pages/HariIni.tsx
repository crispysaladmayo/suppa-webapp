import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import type { SummaryResponse } from '../api/schemas.js';
import { headerDayMonth } from '../lib/formatId.js';
import { addDaysYmd, startOfWeekSunday } from '../lib/week.js';
import { log } from '../logger.js';
import { useTabNav } from '../navigation/TabNavContext.js';
import { HariIniTodayPlan } from '../components/HariIniTodayPlan.js';
import type { z } from 'zod';

type Summary = z.infer<typeof SummaryResponse>;

const BAR_COLORS = ['#c44d34', '#4a7c59', '#2d5a40', '#c9a227'];

function Ring({ pct }: { pct: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  const off = c * (1 - p / 100);
  return (
    <svg className="ring-progress" viewBox="0 0 88 88" aria-hidden>
      <circle cx="44" cy="44" r={r} stroke="rgba(46,40,36,0.12)" />
      <circle
        cx="44"
        cy="44"
        r={r}
        stroke="var(--accent)"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={off}
      />
    </svg>
  );
}

export function HariIni() {
  const { goToTab } = useTabNav();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [persons, setPersons] = useState<Array<Record<string, unknown>>>([]);
  const [groceryTotal, setGroceryTotal] = useState(0);
  const [groceryOpen, setGroceryOpen] = useState(0);
  const [sessions, setSessions] = useState<Array<Record<string, unknown>>>([]);
  const [pantryCount, setPantryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [prepItemId, setPrepItemId] = useState('');
  const [personId, setPersonId] = useState('');
  const [grams, setGrams] = useState('80');
  const [busy, setBusy] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [replaceNextWeek, setReplaceNextWeek] = useState(false);

  const weekStart = useMemo(() => startOfWeekSunday(), []);
  const nextWeekStart = useMemo(() => addDaysYmd(weekStart, 7), [weekStart]);

  async function load() {
    try {
      const [s, p, g, sess, pan] = await Promise.all([
        api.summary(weekStart),
        api.persons(),
        api.grocery(weekStart),
        api.prepSessions(),
        api.pantry(),
      ]);
      setSummary(s);
      setPersons(p.persons);
      setGroceryTotal(g.totalIdrUnchecked);
      setGroceryOpen(g.items.filter((x) => !x.checked).length);
      setSessions(sess.sessions);
      setPantryCount(pan.items.length);
      if (!personId && p.persons[0]?.id) setPersonId(String(p.persons[0].id));
      if (!prepItemId && s.prep.items[0]?.prepItem && typeof s.prep.items[0].prepItem === 'object') {
        const id = (s.prep.items[0].prepItem as { id?: string }).id;
        if (id) setPrepItemId(id);
      }
    } catch (e) {
      log.error('hari_ini_load_failed', { err: String(e) });
      setError('Gagal memuat ringkasan');
    }
  }

  useEffect(() => {
    void load();
  }, [weekStart]);

  const avgRemainingPct = useMemo(() => {
    if (!summary || summary.prep.items.length === 0) return 0;
    const s = summary.prep.items.reduce((a, x) => a + x.ratio, 0);
    return Math.round((s / summary.prep.items.length) * 100);
  }, [summary]);

  const eatenPct = 100 - avgRemainingPct;

  const dayInWeek = new Date().getDay() + 1;

  const alertLine = useMemo(() => {
    if (!summary) return null;
    const crit = summary.prep.items.find((x) => x.state === 'critical');
    const low = summary.prep.items.find((x) => x.state === 'low');
    const row = crit ?? low;
    if (!row) return null;
    const name = String((row.prepItem as { name?: string }).name ?? 'Item');
    if (crit) return `⚠️ ${name} kritis — segera restock atau prep.`;
    return `⚠️ ${name} menipis — habis beberapa hari lagi.`;
  }, [summary]);

  const activeSession = useMemo(
    () => sessions.find((s) => !s.endedAt) ?? null,
    [sessions],
  );

  async function onLog(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const g = Number(grams);
      if (!prepItemId || !personId || !Number.isFinite(g) || g <= 0) {
        setError('Lengkapi log konsumsi');
        return;
      }
      await api.logConsumption({
        prepItemId,
        personId,
        grams: g,
        loggedAt: new Date().toISOString(),
      });
      setGrams('80');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mencatat');
    } finally {
      setBusy(false);
    }
  }

  if (!summary) {
    return (
      <div>
        <p className="eyebrow">{headerDayMonth()}</p>
        <h1 className="screen-title hari-ini-hero-title">Hari ini</h1>
        <p style={{ color: 'var(--text-muted)' }}>{error ?? 'Memuat…'}</p>
      </div>
    );
  }

  const weekPlan = summary.weekPlan ?? {
    totalMeals: 0,
    daysWithMeals: 0,
    recipeBackedMeals: 0,
    mealCountByDay: [0, 0, 0, 0, 0, 0, 0],
  };

  function openPlannerToday() {
    sessionStorage.setItem('nutria.plan.focusDay', String(new Date().getDay()));
    goToTab('rencana');
  }

  return (
    <div>
      <p className="eyebrow">{headerDayMonth()}</p>
      <h1 className="screen-title hari-ini-hero-title">Hari ini</h1>
      <p className="hari-ini-hero-sub">Stok prep · menu keluarga · belanja — satu layar, urut prioritas.</p>

      {alertLine ? (
        <div
          className="hifi-card"
          style={{
            marginTop: 14,
            background: 'var(--warning-bg)',
            borderColor: 'transparent',
            padding: '14px 16px',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--warning-text)', fontWeight: 600 }}>
            {alertLine}
          </p>
        </div>
      ) : null}

      <HariIniTodayPlan
        meals={summary.mealsToday}
        persons={persons}
        weekStart={weekStart}
        onEditInPlanner={openPlannerToday}
      />

      <div className="hifi-card" style={{ marginTop: 14 }}>
        <p className="eyebrow" style={{ letterSpacing: '0.08em' }}>
          Tersisa dari prep minggu
        </p>
        {summary.prep.items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0' }}>Belum ada batch aktif.</p>
        ) : (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 8 }}>
            <div style={{ position: 'relative', width: 88, height: 88 }}>
              <Ring pct={avgRemainingPct} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <span className="screen-title" style={{ fontSize: '1.35rem' }}>
                  {avgRemainingPct}%
                </span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.45 }}>
                {eatenPct}% sudah dimakan · hari ke-{dayInWeek} dari 7
              </p>
            </div>
          </div>
        )}

        {summary.prep.items.length > 0 ? (
          <div style={{ marginTop: 18 }}>
            {summary.prep.items.map((row, i) => {
              const item = row.prepItem as { name?: string; remainingGrams?: number };
              const pct = Math.round(row.ratio * 100);
              const portions = Math.max(1, Math.round((item.remainingGrams ?? 0) / 150));
              const col = BAR_COLORS[i % BAR_COLORS.length];
              return (
                <div key={String((row.prepItem as { id?: string }).id)} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <strong style={{ fontFamily: 'var(--font-serif)' }}>{item.name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {Math.round(item.remainingGrams ?? 0)}g · ~{portions} porsi
                    </span>
                  </div>
                  <div className="progress-track" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: col }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <p
          style={{
            margin: '14px 0 0',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
          }}
        >
          Rencana minggu:{' '}
          <strong style={{ color: 'var(--text)' }}>{weekPlan.totalMeals} menu</strong>{' '}
          · {weekPlan.daysWithMeals} hari terisi · {weekPlan.recipeBackedMeals} dengan resep Nutria
        </p>

        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className="btn-ghost"
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '12px 14px',
              fontWeight: 700,
            }}
            onClick={() => {
              sessionStorage.setItem('nutria.plan.openSummary', '1');
              sessionStorage.setItem('nutria.plan.focusDay', String(new Date().getDay()));
              goToTab('rencana');
            }}
          >
            Lihat detail rencana minggu ›
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: 0 }}
            onClick={() => setPrepModalOpen(true)}
          >
            Susun prep minggu depan ›
          </button>
        </div>
      </div>

      {prepModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setPrepModalOpen(false)}
        >
          <div
            className="modal-sheet hifi-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prep-modal-title"
            onClick={(ev) => ev.stopPropagation()}
            style={{ border: '1px solid var(--border-soft)', margin: 0 }}
          >
            <h3 id="prep-modal-title" className="h-serif" style={{ fontSize: '1.15rem', margin: 0 }}>
              Mulai isi menu prep
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
              Target: minggu mulai <strong>{nextWeekStart}</strong>. Gunakan menu minggu ini (
              {weekStart}) sebagai awalan, atau mulai kosong lalu catat makanan per hari di tab Rencana.
              Setelah menu memakai resep Nutria, finalisasi untuk membuat daftar belanja.
            </p>
            <label
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                fontSize: '0.85rem',
                marginTop: 14,
              }}
            >
              <input
                type="checkbox"
                checked={replaceNextWeek}
                onChange={(ev) => setReplaceNextWeek(ev.target.checked)}
              />
              <span>Jika minggu depan sudah ada menu, timpa dengan salinan dari minggu ini</span>
            </label>
            <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  sessionStorage.setItem(
                    'nutria.plan.bootstrap',
                    JSON.stringify({
                      mode: 'reuse',
                      sourceWeek: weekStart,
                      targetWeek: nextWeekStart,
                      replaceExisting: replaceNextWeek,
                    }),
                  );
                  setPrepModalOpen(false);
                  goToTab('rencana');
                }}
              >
                Ya, pakai ulang menu minggu ini
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ border: '1px solid var(--border)', borderRadius: 14 }}
                onClick={() => {
                  sessionStorage.setItem(
                    'nutria.plan.bootstrap',
                    JSON.stringify({
                      mode: 'fresh',
                      targetWeek: nextWeekStart,
                    }),
                  );
                  setPrepModalOpen(false);
                  goToTab('rencana');
                }}
              >
                Tidak, mulai kosong
              </button>
              <button type="button" className="btn-ghost" onClick={() => setPrepModalOpen(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginTop: 14,
        }}
      >
        <div className="hifi-card" style={{ padding: '14px 14px 16px', background: '#eef4ed' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: 6 }} aria-hidden>
            🛒
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{groceryOpen} item belanjaan</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginTop: 4 }}>
            Rp{groceryTotal.toLocaleString('id-ID')}
          </div>
        </div>
        <div className="hifi-card" style={{ padding: '14px 14px 16px', background: '#faf6e8' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: 6 }} aria-hidden>
            🍞
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            {activeSession ? 'Sesi prep aktif' : 'Belum ada sesi'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
            {activeSession
              ? `Mulai ${String(activeSession.startedAt).slice(11, 16)}`
              : 'Mulai dari tab Prep'}
          </div>
        </div>
      </div>

      <details className="hifi-details hifi-card" style={{ marginTop: 16, padding: '14px 16px' }}>
        <summary style={{ marginBottom: 8 }}>Log konsumsi cepat</summary>
        {summary.prep.items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tambah batch prep dulu untuk mencatat konsumsi.
          </p>
        ) : (
          <form onSubmit={onLog} style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            <select
              className="input"
              value={prepItemId}
              onChange={(ev) => setPrepItemId(ev.target.value)}
            >
              {summary.prep.items.map((row) => {
                const id = String((row.prepItem as { id?: string }).id ?? '');
                const name = String((row.prepItem as { name?: string }).name ?? id);
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <select className="input" value={personId} onChange={(ev) => setPersonId(ev.target.value)}>
              {persons.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {String(p.displayName)}
                </option>
              ))}
            </select>
            <input
              className="input"
              value={grams}
              onChange={(ev) => setGrams(ev.target.value)}
              inputMode="decimal"
              placeholder="Gram"
            />
            {error ? <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</div> : null}
            <button className="btn-primary" type="submit" disabled={busy}>
              Simpan log
            </button>
          </form>
        )}
      </details>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 16 }}>
        {pantryCount} barang di pantry · {groceryOpen} belum dicentang belanja
      </p>
    </div>
  );
}
