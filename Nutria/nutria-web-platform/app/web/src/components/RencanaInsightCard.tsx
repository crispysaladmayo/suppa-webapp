type Insight = {
  badge: number;
  title: string;
  sub: string;
  /** Info = optional nutrition gaps (sage). Accent = recipe linkage (terracotta). */
  badgeVariant?: 'info' | 'accent';
};

type Props = {
  insight: Insight;
  insightOpen: boolean;
  setInsightOpen: (v: boolean) => void;
};

export function RencanaInsightCard({ insight, insightOpen, setInsightOpen }: Props) {
  const variant = insight.badgeVariant ?? 'info';
  return (
    <button type="button" className="tab-insight-card" onClick={() => setInsightOpen(!insightOpen)}>
      <div
        className="tab-insight-card__icon"
        style={{
          background:
            variant === 'info' ? 'var(--tag-fresh-bg)' : 'var(--tan-tag)',
        }}
        aria-hidden
      >
        {variant === 'info' ? '🌿' : '📋'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{insight.title}</span>
          {insight.badge > 0 ? (
            <span
              className={
                variant === 'info' ? 'tab-insight-badge tab-insight-badge--info' : 'tab-insight-badge tab-insight-badge--accent'
              }
            >
              {insight.badge}
            </span>
          ) : null}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {insight.sub}
        </p>
        {insightOpen ? (
          <ul
            style={{
              margin: '10px 0 0',
              paddingLeft: '1.1rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            <li>Isi menu per hari — ringkas dulu, rapi kemudian</li>
            <li>Angka gizi boleh dilengkapi bila sempat; fokus keluarga di jadwal, bukan skor harian</li>
            <li>Resep Nutria → finalisasi → list belanja mengikuti bahan</li>
          </ul>
        ) : null}
      </div>
      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden>
        {insightOpen ? '⌃' : '⌄'}
      </span>
    </button>
  );
}
