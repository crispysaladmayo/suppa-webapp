import { weekStripLabel } from '../lib/formatId.js';

type Props = {
  weekStart: string;
  dayIndex: number;
  setDayIndex: (i: number) => void;
};

export function RencanaWeekDayStrip({ weekStart, dayIndex, setDayIndex }: Props) {
  return (
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
  );
}
