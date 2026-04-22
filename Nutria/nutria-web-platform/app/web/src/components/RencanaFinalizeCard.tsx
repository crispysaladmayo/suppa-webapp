type Props = {
  recipeBacked: number;
  finalizeBusy: boolean;
  error: string | null;
  onFinalize: () => void;
};

export function RencanaFinalizeCard({ recipeBacked, finalizeBusy, error, onFinalize }: Props) {
  return (
    <div className="hifi-card" style={{ marginTop: 12 }}>
      <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
        Finalisasi belanja
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>
        Gabungkan bahan dari semua menu yang punya resep Nutria, hitung total berat perkiraan, dan isi
        daftar belanja (baris lama dari rencana akan diganti).
      </p>
      {error ? <p style={{ color: 'var(--danger)', fontSize: '0.88rem', marginTop: 8 }}>{error}</p> : null}
      <button
        type="button"
        className="btn-primary"
        style={{ marginTop: 12, width: '100%' }}
        disabled={finalizeBusy || recipeBacked === 0}
        onClick={onFinalize}
      >
        {finalizeBusy ? 'Memproses…' : 'Finalisasi & buka Belanja'}
      </button>
      {recipeBacked === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
          Tambah menu dengan resep Nutria dulu agar bahan bisa dijumlahkan.
        </p>
      ) : null}
    </div>
  );
}
