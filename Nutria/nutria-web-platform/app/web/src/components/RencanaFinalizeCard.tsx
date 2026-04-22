type Props = {
  recipeBacked: number;
  finalizeBusy: boolean;
  error: string | null;
  onFinalize: () => void;
};

export function RencanaFinalizeCard({ recipeBacked, finalizeBusy, error, onFinalize }: Props) {
  return (
    <div className="tab-meta-card">
      <p className="tab-module-kicker" style={{ color: 'var(--accent)', marginBottom: 8 }}>
        Biar makin lengkap
      </p>
      <h3 className="h-serif" style={{ fontSize: '1.12rem', margin: 0 }}>
        Rapikan jadi list belanja
      </h3>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>
        Gabungkan bahan dari menu ber-resep ke perkiraan di Belanja. List yang lama dari rencana ini
        diganti yang baru.
      </p>
      {error ? (
        <p style={{ color: 'var(--danger)', fontSize: '0.88rem', marginTop: 10 }} role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        className="btn-primary"
        style={{ marginTop: 14, width: '100%' }}
        disabled={finalizeBusy || recipeBacked === 0}
        onClick={onFinalize}
      >
        {finalizeBusy ? 'Tunggu sebentar…' : 'Finalisasi & buka Belanja'}
      </button>
      {recipeBacked === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.4 }}>
          Pakai resep Nutria dulu — tanpa resep, bahan tidak dijumlah otomatis.
        </p>
      ) : null}
    </div>
  );
}
