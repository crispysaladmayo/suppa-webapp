import { RefObject } from 'react';
import { weekStripLabel } from '../lib/formatId.js';

type Props = {
  summaryRef: RefObject<HTMLDivElement | null>;
  weekStart: string;
  mealsTotal: number;
  recipeBacked: number;
  mealCountByDay: number[];
};

export function RencanaWeekSummaryCard({
  summaryRef,
  weekStart,
  mealsTotal,
  recipeBacked,
  mealCountByDay,
}: Props) {
  return (
    <div ref={summaryRef} className="hifi-card" style={{ marginTop: 12 }}>
      <h3 className="h-serif" style={{ fontSize: '1.05rem', margin: 0 }}>
        Ringkasan minggu ini
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.45 }}>
        {mealsTotal} menu tercatat · {recipeBacked} terhubung resep Nutria (untuk agregasi belanja).
      </p>
      <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        {mealCountByDay.map((n, i) => (
          <div
            key={i}
            style={{
              padding: '6px 10px',
              borderRadius: 10,
              background: n > 0 ? 'var(--accent-soft)' : 'var(--surface-elevated)',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            {weekStripLabel(i, weekStart)}:{n}
          </div>
        ))}
      </div>
    </div>
  );
}
