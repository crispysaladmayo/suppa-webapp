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
    <div ref={summaryRef} className="tab-meta-card">
      <p className="tab-module-kicker" style={{ color: 'var(--accent)', marginBottom: 8 }}>
        Gambaran minggu
      </p>
      <h3 className="h-serif" style={{ fontSize: '1.12rem', margin: 0 }}>
        Ringkasan rencana
      </h3>
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.45 }}>
        {mealsTotal} menu tercatat · {recipeBacked} terhubung ke resep Nutria (untuk menghitung belanja).
      </p>
      <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
        {mealCountByDay.map((n, i) => (
          <div
            key={i}
            style={{
              padding: '6px 10px',
              borderRadius: 10,
              background: n > 0 ? 'var(--accent-soft)' : 'var(--canvas)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: n > 0 ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {weekStripLabel(i, weekStart)} · {n}
          </div>
        ))}
      </div>
    </div>
  );
}
