type Insight = { badge: number; title: string; sub: string };

type Props = {
  insight: Insight;
  insightOpen: boolean;
  setInsightOpen: (v: boolean) => void;
};

export function RencanaInsightCard({ insight, insightOpen, setInsightOpen }: Props) {
  return (
    <button type="button" className="tab-insight-card" onClick={() => setInsightOpen(!insightOpen)}>
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
        aria-hidden
      >
        🌿
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{insight.title}</span>
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
        <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {insight.sub}
        </p>
        {insightOpen ? (
          <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
            Urutan yang enak dijalani: isi menu tiap hari → rapikan kalori & protein kalau sempat → tempel
            resep biar belanja keisi sendiri → finalisasi pas udah kebayang minggunya.
          </p>
        ) : null}
      </div>
      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden>
        {insightOpen ? '⌃' : '⌄'}
      </span>
    </button>
  );
}
