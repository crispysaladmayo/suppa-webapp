type Insight = { badge: number; title: string; sub: string };

type Props = {
  insight: Insight;
  insightOpen: boolean;
  setInsightOpen: (v: boolean) => void;
};

export function RencanaInsightCard({ insight, insightOpen, setInsightOpen }: Props) {
  return (
    <button
      type="button"
      className="hifi-card"
      onClick={() => setInsightOpen(!insightOpen)}
      style={{
        width: '100%',
        marginTop: 14,
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
        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{insight.sub}</p>
        {insightOpen ? (
          <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Alur: catat menu per hari → hubungkan atau simpan resep → finalisasi untuk menghasilkan daftar
            belanja dengan perkiraan berat dan biaya.
          </p>
        ) : null}
      </div>
      <span style={{ color: 'var(--text-muted)' }}>{insightOpen ? '⌃' : '⌄'}</span>
    </button>
  );
}
