import { useState } from 'react';
import { createApiError } from '../api/ApiError.js';
import { ConflictOrErrorBanner } from '../components/ConflictBanner.js';
import {
  IllustrationEmptyCart,
  IllustrationEmptyPlate,
  NutriaEmptyState,
} from '../components/NutriaEmptyState.js';
import {
  BelanjaSkeleton,
  HariIniSkeleton,
  PrepSkeleton,
  RencanaSkeleton,
} from '../components/PageLoadSkeleton.js';
import { useToast } from '../context/ToastContext.js';
import { hapticNudge } from '../lib/haptics.js';

function exitDesignQa() {
  const u = new URL(window.location.href);
  u.searchParams.delete('designqa');
  window.history.replaceState({}, '', u.pathname + u.search + u.hash);
  window.location.reload();
}

/**
 * In-app design QA surface: empty/loading/undo/conflict/motion/haptics in one place.
 * Open: http://localhost:5173/?designqa=1
 */
export function DesignQAPage() {
  const { showToast } = useToast();
  const [showConflict, setShowConflict] = useState(true);

  return (
    <div className="design-qa app-shell" style={{ maxWidth: 430, paddingBottom: 32 }}>
      <div className="design-qa__nav">
        <button type="button" className="design-qa__back" onClick={exitDesignQa}>
          ← Kembali ke aplikasi
        </button>
      </div>
      <p className="eyebrow">Design QA</p>
      <h1 className="screen-title">Nutria — pola UX</h1>
      <p className="tab-hero-lede" style={{ marginTop: 8 }}>
        Audit bar: perjalanan penuh, state kosong, muat, urung, bentrok, ilustrasi, getaran, motion aman, dan
        kualitas copy Bahasa Indonesia.
      </p>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Toast + Urung
        </h2>
        <p className="design-qa__callout">
          Pola <strong>toasts</strong> di bagian bawah, dengan aksi sekunder (urung) untuk reversibel ringan —
          <code> aria-live="polite" </code> pada host.
        </p>
        <button
          type="button"
          className="btn-primary"
          style={{ maxWidth: 280 }}
          onClick={() =>
            showToast('Contoh: perubahan tersimpan', {
              actionLabel: 'Urungkan',
              onAction: () => {
                showToast('Urung berhasil (demo)');
              },
            })
          }
        >
          Tampilkan toast demo
        </button>
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Haptics (lembut)
        </h2>
        <p className="design-qa__callout">API getaran: dukungan penuh jarang di iOS; Android/desktop sering
          mengabaikan — tidak mengandalkan untuk feedback penting.
        </p>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => hapticNudge('success')}
        >
          Tes haptic sukses
        </button>
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Bentrok / sesi
        </h2>
        <p className="design-qa__callout">HTTP 409 memicu salinan yang tenang, dengan muat ulang jelas.</p>
        {showConflict ? (
          <ConflictOrErrorBanner
            error={createApiError('Versi rencana sudah berubah', 409)}
            onRefresh={() => setShowConflict(false)}
            contextLabel="Rencana"
          />
        ) : (
          <button type="button" className="link-quiet" onClick={() => setShowConflict(true)}>
            Tampilkan banner bentrok lagi
          </button>
        )}
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          State kosong + ilustrasi
        </h2>
        <div className="hifi-card" style={{ marginTop: 8, padding: 0, overflow: 'hidden' }}>
          <NutriaEmptyState
            title="Belum ada isi untuk minggu ini"
            body="Isi Rencana dengan resep Nutria lalu rangkum ke Belanja — atau tambah barang manual di sini."
            illustration={<IllustrationEmptyCart />}
            ctaLabel="Buka aplikasi"
            onCta={exitDesignQa}
          />
        </div>
        <div className="hifi-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
          <NutriaEmptyState
            title="Minggu ini belum punya menu"
            body="Tambah menu per waktu makan; ringkasan gizi tampil bila angka tersedia (opsional)."
            illustration={<IllustrationEmptyPlate />}
          />
        </div>
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Loading (skeleton)
        </h2>
        <p className="design-qa__callout">Shimmer dimatikan jika <code>prefers-reduced-motion: reduce</code>.</p>
        <RencanaSkeleton />
        <BelanjaSkeleton />
        <HariIniSkeleton />
        <PrepSkeleton />
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Motion
        </h2>
        <p className="design-qa__callout">
          Transisi entry toast (<code>nutria-motion-raise</code>) hanya jika user tidak meminta reduced motion
          di sistem. Halaman ini memakai gaya kanvas Nutria (cream, serif, terracotta).
        </p>
      </section>

      <section>
        <h2 className="h-serif" style={{ fontSize: '1.15rem' }}>
          Dokumentasi
        </h2>
        <p className="design-qa__callout" style={{ marginBottom: 0 }}>
          Baca <code>Nutria/product/NUTRIA_DESIGN_AUDIT_UX_2026.md</code> untuk audit penuh, daftar QA, dan
          skrip uji pengguna.
        </p>
      </section>
    </div>
  );
}
