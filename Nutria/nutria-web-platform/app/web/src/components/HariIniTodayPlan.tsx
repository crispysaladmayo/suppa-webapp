import { useMemo } from 'react';
import { dayFullName, weekRangeLabel } from '../lib/formatId.js';

const SLOT_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const SLOT_LABEL: Record<string, string> = {
  breakfast: 'Sarapan',
  lunch: 'Makan siang',
  dinner: 'Makan malam',
  snack: 'Camilan',
};

const SLOT_RAIL: Record<string, string> = {
  breakfast: 'var(--sage-deep)',
  lunch: 'var(--accent)',
  dinner: '#2d5a40',
  snack: '#c9a227',
};

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

function slotSortKey(slot: string): number {
  const i = SLOT_ORDER.indexOf(slot as (typeof SLOT_ORDER)[number]);
  return i === -1 ? 99 : i;
}

type Props = {
  meals: Array<Record<string, unknown>>;
  persons: Array<Record<string, unknown>>;
  weekStart: string;
  onEditInPlanner: () => void;
};

export function HariIniTodayPlan({ meals, persons, weekStart, onEditInPlanner }: Props) {
  const todayDow = new Date().getDay();
  const dayName = dayFullName(todayDow);
  const weekLabel = weekRangeLabel(weekStart);

  const sorted = useMemo(
    () => [...meals].sort((a, b) => slotSortKey(String(a.slot)) - slotSortKey(String(b.slot))),
    [meals],
  );

  return (
    <section className="today-plan-section" aria-labelledby="today-plan-heading">
      <div className="today-plan-header">
        <div>
          <p className="today-plan-kicker" id="today-plan-heading">
            Menu keluarga hari ini
          </p>
          <p className="today-plan-lede">
            <span className="today-plan-lede-strong">{dayName}</span>
            <span className="today-plan-lede-dot" aria-hidden>
              ·
            </span>
            <span className="today-plan-lede-muted">Minggu {weekLabel}</span>
          </p>
          {sorted.length > 0 ? (
            <p className="today-plan-meta">{sorted.length} menu · urut dari sarapan sampai camilan</p>
          ) : null}
        </div>
        <button type="button" className="btn-today-plan-edit" onClick={onEditInPlanner}>
          Ubah di tab Rencana
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="today-plan-empty">
          <p className="today-plan-empty-title">Belum ada menu untuk hari ini</p>
          <p className="today-plan-empty-body">
            Isi di tab Rencana — keluarga melihat jadwal yang sama tanpa tanya berulang.
          </p>
          <button type="button" className="btn-primary today-plan-empty-cta" onClick={onEditInPlanner}>
            Buka Rencana
          </button>
        </div>
      ) : (
        <ol className="today-plan-timeline">
          {sorted.map((m) => {
            const slot = String(m.slot);
            const rail = SLOT_RAIL[slot] ?? 'var(--accent)';
            const pid = String(m.personId ?? '');
            const person = persons.find((p) => String(p.id) === pid);
            const who = String(person?.displayName ?? '');
            const fresh = Boolean(m.isFresh);
            const kcalStr = m.kcal != null ? `${Math.round(Number(m.kcal))} kkal` : null;
            const protStr = m.proteinG != null ? `${Math.round(Number(m.proteinG))} g prot` : null;
            const carbStr = m.carbsG != null ? `${Math.round(Number(m.carbsG))} g karb` : null;
            const fatStr = m.fatG != null ? `${Math.round(Number(m.fatG))} g lemak` : null;
            const macroParts = [kcalStr, protStr, carbStr, fatStr].filter(Boolean);
            const macroLine = macroParts.length > 0 ? macroParts.join(' · ') : null;

            return (
              <li key={String(m.id)} className="today-plan-row">
                <div className="today-plan-rail" style={{ background: rail }} aria-hidden />
                <article className="today-plan-card">
                  <div className="today-plan-card-top">
                    <div className="today-plan-icon" aria-hidden>
                      {MEAL_ICON[slot] ?? '🍽️'}
                    </div>
                    <div className="today-plan-card-main">
                      <div className="today-plan-slot-row">
                        <span className="today-plan-slot">{SLOT_LABEL[slot] ?? slot}</span>
                        {m.recipeId ? <span className="today-plan-pill today-plan-pill--recipe">Resep</span> : null}
                        {fresh ? (
                          <span className="today-plan-pill today-plan-pill--fresh">Segar</span>
                        ) : (
                          <span className="today-plan-pill today-plan-pill--prep">Prep</span>
                        )}
                      </div>
                      <h3 className="today-plan-title h-serif">{String(m.title)}</h3>
                      {m.notes ? <p className="today-plan-notes">{String(m.notes)}</p> : null}
                      {macroLine ? <p className="today-plan-macros">{macroLine}</p> : null}
                    </div>
                    {who ? (
                      <div className="today-plan-avatar" title={who} aria-label={`Buat ${who}`}>
                        {initialOf(who)}
                      </div>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
