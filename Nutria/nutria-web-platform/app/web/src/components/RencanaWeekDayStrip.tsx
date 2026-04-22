import { weekStripLabel } from '../lib/formatId.js';

type Props = {
  weekStart: string;
  dayIndex: number;
  setDayIndex: (i: number) => void;
  mealCountByDay?: number[];
};

export function RencanaWeekDayStrip({ weekStart, dayIndex, setDayIndex, mealCountByDay }: Props) {
  return (
    <div
      className="week-day-strip"
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        marginBottom: 0,
        scrollbarWidth: 'none',
      }}
    >
      {Array.from({ length: 7 }, (_, i) => {
        const active = i === dayIndex;
        const n = mealCountByDay?.[i] ?? 0;
        const hasMeals = n > 0;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setDayIndex(i)}
            aria-current={active ? 'true' : undefined}
            aria-label={`${weekStripLabel(i, weekStart)}, ${n} menu tercatat`}
            style={{
              flex: '0 0 auto',
              minWidth: 58,
              padding: '12px 12px',
              borderRadius: 16,
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
              className={hasMeals && !active ? 'week-strip-dot--has-meals' : undefined}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: active ? 'var(--accent)' : hasMeals ? 'var(--sage-deep)' : 'var(--accent-soft)',
                margin: '8px auto 0',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
