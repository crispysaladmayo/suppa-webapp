import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.js';
import { IllustrationEmptyPlate, NutriaEmptyState } from '../components/NutriaEmptyState.js';
import { PrepSkeleton } from '../components/PageLoadSkeleton.js';
import { dayFullName, headerDayMonth } from '../lib/formatId.js';
import { log } from '../logger.js';

const ING_ICON = ['🍗', '🥚', '🍠', '🌽'];

export function Prep() {
  const [sessions, setSessions] = useState<Array<Record<string, unknown>>>([]);
  const [ingredients, setIngredients] = useState<Array<Record<string, unknown>>>([]);
  const [steps, setSteps] = useState<Array<Record<string, unknown>>>([]);
  const [ingName, setIngName] = useState('Dada ayam');
  const [ingKg, setIngKg] = useState('5.6');
  const [ingShrink, setIngShrink] = useState('25');
  const [stepTitle, setStepTitle] = useState('Siapkan bahan');
  const [notes, setNotes] = useState('Prep hari Minggu');
  const [error, setError] = useState<string | null>(null);
  const [sessionsReady, setSessionsReady] = useState(false);

  const active = useMemo(
    () => sessions.find((s) => !s.endedAt) ?? null,
    [sessions],
  );
  const activeId = active ? String(active.id) : null;

  async function loadSessions() {
    setSessionsReady(false);
    try {
      const s = await api.prepSessions();
      setSessions(s.sessions);
    } catch (e) {
      log.error('prep_load_failed', { err: String(e) });
      setError('Sesi prep belum kebuka — cek koneksi kamu dulu, terus coba lagi ya.');
    } finally {
      setSessionsReady(true);
    }
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  useEffect(() => {
    async function loadDetail() {
      if (!activeId) {
        setIngredients([]);
        setSteps([]);
        return;
      }
      try {
        const [ing, st] = await Promise.all([
          api.prepSessionIngredients(activeId),
          api.prepSessionSteps(activeId),
        ]);
        setIngredients(ing.ingredients);
        setSteps(st.steps);
      } catch (e) {
        log.error('prep_detail_failed', { err: String(e) });
      }
    }
    void loadDetail();
  }, [activeId]);

  const estPortions = useMemo(() => {
    const sumKg = ingredients.reduce((a, x) => a + (Number(x.rawKg) || 0), 0);
    if (sumKg <= 0) return 14;
    return Math.max(4, Math.round(sumKg / 0.4));
  }, [ingredients]);

  async function startSession(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createPrepSession({ notes });
      setNotes('Prep hari Minggu');
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Belum bisa mulai sesi — coba lagi bentar lagi ya.');
    }
  }

  async function endSession(id: string) {
    setError(null);
    try {
      await api.patchPrepSession(id, { endedAt: new Date().toISOString() });
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Belum bisa nutup sesi — coba lagi sebentar.');
    }
  }

  async function addIngredient(e: FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    setError(null);
    try {
      const rawKg = Number(ingKg);
      const shrinkPct = Number(ingShrink);
      if (!ingName.trim() || !Number.isFinite(rawKg) || !Number.isFinite(shrinkPct)) {
        setError('Isi nama bahannya ya, plus berat (kg) & susut (%) yang valid.');
        return;
      }
      await api.addPrepSessionIngredient(activeId, {
        name: ingName.trim(),
        rawKg,
        shrinkPct,
        sortOrder: ingredients.length,
      });
      setIngName('Dada ayam');
      setIngKg('5.6');
      setIngShrink('25');
      const ing = await api.prepSessionIngredients(activeId);
      setIngredients(ing.ingredients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bahan belum ke-save — coba lagi ya.');
    }
  }

  async function addStep(e: FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    setError(null);
    try {
      if (!stepTitle.trim()) return;
      await api.addPrepSessionStep(activeId, { title: stepTitle.trim(), sortOrder: steps.length });
      setStepTitle('Rebus ubi madu');
      const st = await api.prepSessionSteps(activeId);
      setSteps(st.steps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Langkah belum ke-save — coba lagi ya.');
    }
  }

  const clock =
    active && typeof active.startedAt === 'string'
      ? String(active.startedAt).slice(11, 16)
      : '--:--';
  const dow = dayFullName(new Date().getDay());

  if (!sessionsReady) {
    return (
      <div>
        <p className="eyebrow">
          {headerDayMonth()} · lagi disiapin
        </p>
        <h1 className="screen-title">Prep hari {dayFullName(new Date().getDay())}</h1>
        <PrepSkeleton />
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow">
        {headerDayMonth()} · mulai {clock}
      </p>
      <h1 className="screen-title">Prep hari {dow}</h1>
      <p className="tab-hero-lede">
        Satu sesi: berat mentah, susut, urutan masak. Porsi estimasi dari total kg (bukan timbangan pasti).
      </p>

      {error ? (
        <div
          role="alert"
          style={{
            marginTop: 12,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--danger-soft, #fde8e8)',
            color: 'var(--danger)',
            fontSize: '0.88rem',
          }}
        >
          {error}
        </div>
      ) : null}

      {!active ? (
        <div className="hifi-card tab-module-form" style={{ marginTop: 14, padding: 0, overflow: 'hidden' }}>
          <NutriaEmptyState
            title="Belum ada sesi prep yang jalan"
            body="Satu sesi: catat bahan, susut, urutan — nanti gampang dilacak"
            illustration={<IllustrationEmptyPlate />}
          />
          <div style={{ padding: '0 18px 18px' }}>
            <p className="prep-section-kicker" style={{ marginTop: 0 }}>
              Mulai yang baru
            </p>
            <h3 className="h-serif" style={{ fontSize: '1.1rem' }}>
              Yuk prep hari {dow}
            </h3>
            <form onSubmit={startSession} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <FormField
              label="Catatan kecil (opsional)"
              hint="Misal: prep Minggu pagi, buat bekal anak & suami"
              fieldId="prep-start-notes"
            >
              <input
                id="prep-start-notes"
                className="input"
                value={notes}
                onChange={(ev) => setNotes(ev.target.value)}
                aria-describedby="prep-start-notes-hint"
              />
            </FormField>
            <button className="btn-primary" type="submit">
              Mulai prep sekarang
            </button>
          </form>
          </div>
        </div>
      ) : (
        <>
          <div className="prep-session-hero">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p className="eyebrow" style={{ color: 'rgba(46,40,36,0.65)' }}>
                  Total waktu
                </p>
                <div className="h-serif" style={{ fontSize: '1.65rem' }}>
                  2j 30m
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 4 }}>
                  {clock} – selesai estimasi
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="eyebrow" style={{ color: 'rgba(46,40,36,0.65)' }}>
                  Hasil
                </p>
                <div className="h-serif" style={{ fontSize: '1.65rem' }}>
                  {estPortions}
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 4 }}>
                  porsi makan · 7 hari
                </div>
              </div>
            </div>
            <div className="progress-track" style={{ marginTop: 18, background: 'rgba(46,40,36,0.15)' }}>
              <div className="progress-fill" style={{ width: '12%', background: 'var(--accent)' }} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                marginTop: 8,
                opacity: 0.9,
              }}
            >
              <span>0% selesai</span>
              <span>0/150 mnt</span>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginTop: 14, width: '100%', background: 'rgba(255,255,255,0.35)' }}
              onClick={() => void endSession(activeId!)}
            >
              Selesai prep untuk kali ini
            </button>
          </div>

          <div style={{ marginTop: 22 }}>
            <p className="prep-section-kicker" style={{ marginTop: 0 }}>
              Bahan & perkiraan porsi
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 className="h-serif" style={{ fontSize: '1.2rem' }}>
                Bahan utama
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>kira-kira buat 7 hari</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: 12,
              }}
            >
              {ingredients.slice(0, 4).map((ing, i) => {
                const cooked = (Number(ing.rawKg) || 0) * (1 - (Number(ing.shrinkPct) || 0) / 100);
                return (
                  <div key={String(ing.id)} className="hifi-card prep-ingredient-tile">
                    <div style={{ fontSize: '1.2rem', marginBottom: 8 }}>{ING_ICON[i % ING_ICON.length]}</div>
                    <div className="prep-ingredient-name">{String(ing.name)}</div>
                    <div className="h-serif" style={{ fontSize: '1.05rem', marginTop: 6 }}>
                      {Number(ing.rawKg).toFixed(1)} kg
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.35 }}>
                      → {cooked.toFixed(1)}kg matang (susut {Number(ing.shrinkPct)}%)
                    </div>
                  </div>
                );
              })}
              {ingredients.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Tambah bahan di bawah ya — yang tampil di kisi cuma empat pertama (sisanya tetap ke-save).
                </p>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <p className="prep-section-kicker">Urutan kerja di dapur</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="h-serif" style={{ fontSize: '1.2rem' }}>
                Urutan masak
              </h3>
              <span
                className="tag-prep"
                style={{ fontSize: '0.62rem', background: 'rgba(212,149,71,0.25)', color: '#5c4f3d' }}
              >
                ceklis
              </span>
            </div>
            <div className="hifi-card" style={{ marginTop: 12, padding: '8px 0' }}>
              {steps.length === 0 ? (
                <p style={{ padding: '12px 16px', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Belum ada langkah — tambah dari form di bawah, pelan-pelan aja.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {steps.map((st, idx) => (
                    <li
                      key={String(st.id)}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border-soft)',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          border: '2px solid var(--border)',
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {clock} · {15 + idx * 15} mnt
                        </div>
                        <div className="h-serif" style={{ fontSize: '1.02rem', marginTop: 4 }}>
                          {String(st.title)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form onSubmit={addStep} style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <FormField label="Langkah berikutnya" hint="Misal: rebus ayam, kupas ubi" fieldId="prep-step-title">
                  <input
                    id="prep-step-title"
                    className="input"
                    value={stepTitle}
                    onChange={(ev) => setStepTitle(ev.target.value)}
                    placeholder="contoh: Rebus ayam 20 menit"
                    aria-describedby="prep-step-title-hint"
                  />
                </FormField>
              </div>
              <button
                className="btn-primary"
                type="submit"
                style={{ width: 'auto', padding: '12px 18px', flexShrink: 0 }}
                aria-label="Tambah langkah masak"
              >
                +
              </button>
            </form>
          </div>

          <p className="prep-section-kicker">Catat bahan ke sesi</p>
          <div className="hifi-card tab-module-form" style={{ marginTop: 0 }}>
            <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
              Tambah bahan buat sesi ini
            </h3>
            <form onSubmit={addIngredient} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
              <FormField label="Nama bahan" hint="Contoh: Dada ayam tanpa tulang" fieldId="prep-ing-name">
                <input
                  id="prep-ing-name"
                  className="input"
                  value={ingName}
                  onChange={(ev) => setIngName(ev.target.value)}
                  aria-describedby="prep-ing-name-hint"
                />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <FormField label="Berat mentah (kg)" fieldId="prep-ing-kg">
                  <input
                    id="prep-ing-kg"
                    className="input"
                    value={ingKg}
                    onChange={(ev) => setIngKg(ev.target.value)}
                    inputMode="decimal"
                  />
                </FormField>
                <FormField label="Susut (%)" hint="Setelah matang / kupas" fieldId="prep-ing-shrink">
                  <input
                    id="prep-ing-shrink"
                    className="input"
                    value={ingShrink}
                    onChange={(ev) => setIngShrink(ev.target.value)}
                    inputMode="numeric"
                    aria-describedby="prep-ing-shrink-hint"
                  />
                </FormField>
              </div>
              <button className="btn-primary" type="submit">
                Simpan bahan
              </button>
            </form>
          </div>
        </>
      )}

      {sessions.filter((s) => s.endedAt).length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <p className="prep-section-kicker">Yang udah selesai</p>
          {sessions
            .filter((s) => s.endedAt)
            .map((s) => (
              <div key={String(s.id)} className="hifi-card" style={{ marginTop: 8, padding: '12px 14px' }}>
                <span className="tag-prep">Selesai</span>
                <div style={{ marginTop: 6, fontSize: '0.88rem' }}>{String(s.notes ?? 'Sesi')}</div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}
