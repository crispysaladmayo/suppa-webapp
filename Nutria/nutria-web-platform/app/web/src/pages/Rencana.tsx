import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { dayFullName, weekRangeLabel, weekStripLabel } from '../lib/formatId.js';
import { startOfWeekSunday } from '../lib/week.js';
import { log } from '../logger.js';

const SLOT_LABEL: Record<string, string> = {
  breakfast: 'SARAPAN',
  lunch: 'MAKAN SIANG',
  dinner: 'MAKAN MALAM',
  snack: 'CAMILAN',
};

const SLOT_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const MEAL_ICON: Record<string, string> = {
  breakfast: '🥤',
  lunch: '🍗',
  dinner: '🍲',
  snack: '🍌',
};

function initialOf(name: string): string {
  const t = name.trim();
  return t ? t[0]!.toUpperCase() : '?';
}

export function Rencana() {
  const formRef = useRef<HTMLDivElement>(null);
  const [weekStart, setWeekStart] = useState(startOfWeekSunday());
  const [dayIndex, setDayIndex] = useState(() => new Date().getDay());
  const [meals, setMeals] = useState<Array<Record<string, unknown>>>([]);
  const [persons, setPersons] = useState<Array<Record<string, unknown>>>([]);
  const [title, setTitle] = useState('Healthy shake');
  const [slot, setSlot] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [personId, setPersonId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [insightOpen, setInsightOpen] = useState(false);

  async function load() {
    try {
      const [m, p] = await Promise.all([api.meals(weekStart), api.persons()]);
      setMeals(m.meals);
      setPersons(p.persons);
      if (!personId && p.persons[0]?.id) setPersonId(String(p.persons[0].id));
    } catch (e) {
      log.error('rencana_load_failed', { err: String(e) });
      setError('Gagal memuat rencana');
    }
  }

  useEffect(() => {
    void load();
  }, [weekStart]);

  const filtered = useMemo(
    () => meals.filter((m) => Number(m.dayIndex) === dayIndex),
    [meals, dayIndex],
  );

  const groupedSlots = useMemo(() => {
    const m = new Map<string, Array<Record<string, unknown>>>();
    for (const s of SLOT_ORDER) m.set(s, []);
    for (const meal of filtered) {
      const sl = String(meal.slot);
      if (!m.has(sl)) m.set(sl, []);
      m.get(sl)!.push(meal);
    }
    return SLOT_ORDER.map((s) => [s, m.get(s)!] as const).filter(([, list]) => list.length > 0);
  }, [filtered]);

  const insight = useMemo(() => {
    const week = meals;
    const noMacro = week.filter((m) => m.kcal == null || m.proteinG == null).length;
    const badge = Math.min(3, Math.max(1, noMacro || 1));
    if (noMacro === 0) {
      return {
        badge: 0,
        title: 'Protein sudah cukup 💪',
        sub: 'Semua entri punya data makro · ketuk untuk detail',
      };
    }
    return {
      badge,
      title: 'Lengkapi data makro',
      sub: `${noMacro} menu belum ada kkal/protein · ketuk untuk detail`,
    };
  }, [meals]);

  async function addMeal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createMeal({
        weekStart,
        dayIndex,
        slot,
        personId,
        title,
        isFresh: slot !== 'lunch',
      });
      setTitle('Healthy shake');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah');
    }
  }

  async function onAiIdeas() {
    setError(null);
    try {
      const res = await api.mealIdeas();
      const suggestions = (res.suggestions as string[] | undefined) ?? [];
      if (suggestions[0]) setTitle(suggestions[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil saran');
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div>
      <p className="eyebrow">{weekRangeLabel(weekStart)}</p>
      <div className="fab-row">
        <h2 className="screen-title" style={{ flex: 1 }}>
          Rencana minggu
        </h2>
        <button type="button" className="btn-icon" aria-label="Tambah menu" onClick={scrollToForm}>
          +
        </button>
      </div>

      <button
        type="button"
        className="hifi-card"
        onClick={() => setInsightOpen(!insightOpen)}
        style={{
          width: '100%',
          marginTop: 4,
          marginBottom: 14,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          textAlign: 'left',
          cursor: 'pointer',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'var(--tag-fresh-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          🌿
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{insight.title}</span>
            {insight.badge > 0 ? (
              <span
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                }}
              >
                {insight.badge}
              </span>
            ) : null}
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {insight.sub}
          </p>
          {insightOpen ? (
            <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Tambah kkal & protein di entri menu (edit dari API / pengembangan berikutnya).
            </p>
          ) : null}
        </div>
        <span style={{ color: 'var(--text-muted)' }}>{insightOpen ? '⌃' : '⌄'}</span>
      </button>

      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 10,
          marginBottom: 6,
          scrollbarWidth: 'none',
        }}
      >
        {Array.from({ length: 7 }, (_, i) => {
          const active = i === dayIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setDayIndex(i)}
              style={{
                flex: '0 0 auto',
                minWidth: 56,
                padding: '10px 12px',
                borderRadius: 14,
                border: active ? 'none' : '1px solid var(--border)',
                background: active ? 'var(--text)' : 'var(--surface-elevated)',
                color: active ? '#fff' : 'var(--text)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: active ? 'var(--shadow-soft)' : 'none',
              }}
            >
              {weekStripLabel(i, weekStart)}
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: active ? 'var(--accent)' : 'var(--accent-soft)',
                  margin: '6px auto 0',
                }}
              />
            </button>
          );
        })}
      </div>

      <button type="button" className="btn-ghost" style={{ marginBottom: 14, fontSize: '0.82rem' }} onClick={() => setWeekStart(startOfWeekSunday())}>
        Lompat ke minggu ini
      </button>

      <h3 className="h-serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>
        {dayFullName(dayIndex)}
      </h3>

      {groupedSlots.length === 0 ? (
        <div className="hifi-card" style={{ marginBottom: 14 }}>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Belum ada menu untuk hari ini.</p>
        </div>
      ) : (
        groupedSlots.map(([sl, list]) => (
          <div key={sl} style={{ marginBottom: 18 }}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>
              {SLOT_LABEL[sl]} · {list.length}
            </p>
            {list.map((m) => {
              const pid = String(m.personId);
              const person = persons.find((p) => String(p.id) === pid);
              const who = String(person?.displayName ?? '?');
              const fresh = Boolean(m.isFresh);
              const kcal = m.kcal != null ? `${Math.round(Number(m.kcal))}kkal` : '—';
              const prot = m.proteinG != null ? `${Math.round(Number(m.proteinG))}g protein` : '—';
              return (
                <div className="hifi-card" key={String(m.id)} style={{ marginBottom: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: 'var(--canvas)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0,
                      }}
                    >
                      {MEAL_ICON[sl] ?? '🍽️'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        {fresh ? <span className="tag-segar">segar</span> : <span className="tag-prep">prep</span>}
                      </div>
                      <div className="h-serif" style={{ fontSize: '1.12rem', marginTop: 8 }}>
                        {String(m.title)}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                        {m.notes ? String(m.notes) : 'Tambahkan bahan di catatan menu'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        {kcal} · {prot}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <span
                        title={who}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          background: '#6b3d4a',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {initialOf(who)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}

      <div className="hifi-card" ref={formRef} style={{ marginTop: 8 }}>
        <h3 className="h-serif" style={{ fontSize: '1.1rem' }}>
          Tambah menu
        </h3>
        <form onSubmit={addMeal} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <input className="input" value={title} onChange={(ev) => setTitle(ev.target.value)} />
          <button type="button" className="btn-ghost" onClick={onAiIdeas} style={{ width: '100%' }}>
            Saran AI
          </button>
          <select className="input" value={slot} onChange={(ev) => setSlot(ev.target.value as typeof slot)}>
            <option value="breakfast">Sarapan</option>
            <option value="lunch">Makan siang</option>
            <option value="dinner">Makan malam</option>
            <option value="snack">Camilan</option>
          </select>
          <select className="input" value={personId} onChange={(ev) => setPersonId(ev.target.value)}>
            {persons.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>
                {String(p.displayName)}
              </option>
            ))}
          </select>
          {error ? <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</div> : null}
          <button className="btn-primary" type="submit">
            Simpan menu
          </button>
        </form>
      </div>
    </div>
  );
}
