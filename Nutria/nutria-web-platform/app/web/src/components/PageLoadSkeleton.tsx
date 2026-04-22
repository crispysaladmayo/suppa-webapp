export function RencanaSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Memuat rencana">
      <div className="sk sk-line sk-line--eyebrow" />
      <div className="sk sk-line sk-line--title" />
      <div className="sk sk-line sk-line--p" style={{ maxWidth: '100%' }} />
      <div className="hifi-card" style={{ marginTop: 16, padding: 16 }}>
        <div className="sk-strip">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="sk sk-pill" />
          ))}
        </div>
      </div>
      <div className="sk sk-line sk-line--h2" style={{ marginTop: 20 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="hifi-card" style={{ marginTop: 10, padding: 14, display: 'flex', gap: 12 }}>
          <div className="sk sk-avatar" />
          <div style={{ flex: 1 }}>
            <div className="sk sk-line" style={{ width: '60%' }} />
            <div className="sk sk-line" style={{ width: '40%', marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BelanjaSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Memuat belanja">
      <div className="sk sk-line sk-line--eyebrow" />
      <div className="sk sk-line sk-line--title" />
      <div
        className="belanja-hero"
        style={{ marginTop: 12, minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <div className="sk sk-line" style={{ width: '50%', background: 'rgba(255,255,255,0.2)' }} />
        <div className="sk sk-line sk-line--title" style={{ width: '70%', marginTop: 12, background: 'rgba(255,255,255,0.25)' }} />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="hifi-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
          <div className="sk" style={{ height: 48, borderRadius: 0 }} />
          <div style={{ padding: 12, display: 'grid', gap: 10 }}>
            <div className="sk sk-line" />
            <div className="sk sk-line" style={{ width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HariIniSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Memuat hari ini">
      <div className="sk sk-line" style={{ width: '45%' }} />
      <div className="sk sk-line sk-line--title" style={{ marginTop: 4 }} />
      <div className="hifi-card" style={{ marginTop: 16, minHeight: 140, display: 'grid', placeItems: 'center' }}>
        <div className="sk" style={{ width: 88, height: 88, borderRadius: '50%' }} />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="hifi-card" style={{ marginTop: 12, minHeight: 72 }} />
      ))}
    </div>
  );
}

export function PrepSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Memuat prep">
      <div className="sk sk-line" style={{ width: '40%' }} />
      <div className="sk sk-line sk-line--title" />
      <div
        className="hifi-card"
        style={{
          marginTop: 12,
          minHeight: 120,
          background: 'linear-gradient(135deg, var(--prep-gold-1), var(--prep-gold-2))',
          opacity: 0.35,
        }}
      />
      <div className="sk-grid-2" style={{ marginTop: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="hifi-card" style={{ minHeight: 80, padding: 12 }}>
            <div className="sk sk-line" />
            <div className="sk sk-line" style={{ width: '50%', marginTop: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
