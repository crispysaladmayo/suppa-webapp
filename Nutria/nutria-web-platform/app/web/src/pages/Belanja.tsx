import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.js';
import {
  IllustrationEmptyCart,
  NutriaEmptyState,
} from '../components/NutriaEmptyState.js';
import { BelanjaSkeleton } from '../components/PageLoadSkeleton.js';
import { useToast } from '../context/ToastContext.js';
import { startOfWeekSunday } from '../lib/week.js';
import { log } from '../logger.js';
import { useTabNav } from '../navigation/TabNavContext.js';

const SECTION_LABEL: Record<string, { label: string; emoji: string; tint: string }> = {
  produce: { label: 'Sayur & buah', emoji: '🥬', tint: '#e3efe0' },
  meat: { label: 'Protein', emoji: '🥩', tint: '#f5e3e6' },
  dairy: { label: 'Susu & telur', emoji: '🥛', tint: '#f0f4fa' },
  frozen: { label: 'Beku', emoji: '❄️', tint: '#e8f4fc' },
  pantry: { label: 'Sembako', emoji: '🫙', tint: '#f5f0e6' },
  other: { label: 'Lainnya', emoji: '📦', tint: '#efe9df' },
};

function sectionMeta(key: string) {
  return SECTION_LABEL[key] ?? { label: key, emoji: '📦', tint: '#efe9df' };
}

export function Belanja() {
  const { goToTab } = useTabNav();
  const { showToast } = useToast();
  const addFormRef = useRef<HTMLDivElement>(null);
  const [weekStart] = useState(startOfWeekSunday());
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [listLoading, setListLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const [name, setName] = useState('');
  const [section, setSection] = useState('produce');
  const [qtyText, setQtyText] = useState('');
  const [price, setPrice] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSection, setEditSection] = useState('produce');
  const [editQtyText, setEditQtyText] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [listError, setListError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  async function load() {
    setListLoading(true);
    try {
      const [g, p] = await Promise.all([api.grocery(weekStart), api.pantry()]);
      setListError(null);
      setItems(g.items);
      setTotal(g.totalIdrUnchecked);
      setPantryCount(p.items.length);
    } catch (e) {
      log.error('belanja_load_failed', { err: String(e) });
      setListError('List belanja belum terbuka. Cek sambungan internet, lalu coba lagi.');
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [weekStart]);

  const grouped = useMemo(() => {
    const m = new Map<string, Array<Record<string, unknown>>>();
    for (const it of items) {
      const sec = String(it.section);
      if (!m.has(sec)) m.set(sec, []);
      m.get(sec)!.push(it);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      for (const [k] of grouped) {
        if (next[k] === undefined) next[k] = true;
      }
      return next;
    });
  }, [grouped]);

  const checkedCount = useMemo(() => items.filter((x) => x.checked).length, [items]);
  const totalCount = items.length;
  const cartProgress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  function startEdit(it: Record<string, unknown>) {
    const id = String(it.id);
    setEditingId(id);
    setEditName(String(it.name));
    setEditSection(String(it.section));
    setEditQtyText(it.qtyText != null ? String(it.qtyText) : '');
    setEditPrice(it.priceIdrPerUnit != null ? String(it.priceIdrPerUnit) : '');
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (!name.trim()) {
      setAddError('Tulis nama barangnya dulu ya.');
      return;
    }
    try {
      const priceIdr = price.trim() === '' ? null : Number(price.replace(/\./g, ''));
      await api.createGrocery({
        weekStart,
        name: name.trim(),
        section,
        qtyText: qtyText.trim() || null,
        priceIdrPerUnit: Number.isFinite(priceIdr as number) ? priceIdr : null,
        checked: false,
      });
      setName('');
      setQtyText('');
      setPrice('');
      await load();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Belum tersimpan. Coba lagi sebentar.');
    }
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditError(null);
    if (!editName.trim()) {
      setEditError('Namanya jangan dikosongin ya.');
      return;
    }
    try {
      const priceIdr = editPrice.trim() === '' ? null : Number(editPrice.replace(/\./g, ''));
      await api.patchGrocery(editingId, {
        name: editName.trim(),
        section: editSection,
        qtyText: editQtyText.trim() || null,
        priceIdrPerUnit: Number.isFinite(priceIdr as number) ? priceIdr : null,
      });
      cancelEdit();
      await load();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Perubahan belum tersimpan. Coba lagi sebentar.');
    }
  }

  async function toggle(id: string, wasChecked: boolean) {
    const nextChecked = !wasChecked;
    try {
      await api.patchGrocery(id, { checked: nextChecked });
      await load();
      showToast(nextChecked ? 'Masuk keranjang — mantap' : 'Oke, centangnya dilepas dulu', {
        actionLabel: 'Urungkan',
        onAction: async () => {
          await api.patchGrocery(id, { checked: wasChecked });
          await load();
        },
      });
    } catch (err) {
      setListError(
        err instanceof Error
          ? err.message
          : 'Belum tersimpan. Cek sambungan, lalu coba lagi.',
      );
    }
  }

  function toggleSection(key: string) {
    setOpenMap((m) => ({ ...m, [key]: !(m[key] ?? true) }));
  }

  function scrollToAdd() {
    addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const first = document.getElementById('g-add-name');
    window.setTimeout(() => first?.focus(), 350);
  }

  if (listLoading && totalCount === 0 && !listError) {
    return (
      <div>
        <p className="eyebrow">Belanja buat minggu ini</p>
        <div className="fab-row">
          <h1 className="screen-title" style={{ flex: 1 }}>
            Belanja
          </h1>
        </div>
        <BelanjaSkeleton />
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow">Belanja buat minggu ini</p>
      <div className="fab-row">
        <h1 className="screen-title" style={{ flex: 1 }}>
          Belanja
        </h1>
        <button
          type="button"
          className="btn-icon"
          aria-label="Tambah barang — geser ke form"
          onClick={scrollToAdd}
        >
          +
        </button>
      </div>
      <p className="tab-hero-lede">
        Centang saat barang masuk keranjang. Total hanya memuat baris yang belum dicentang. Ketuk baris
        untuk mengubah. Bila list berasal dari rencana + finalisasi, baris selaras menu mingguan.
      </p>

      {listError ? (
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
          {listError}
        </div>
      ) : null}

      <div className="belanja-hero">
        <p className="eyebrow" style={{ color: 'var(--grocery-hero-muted)' }}>
          Perkiraan total (yang belum dicentang)
        </p>
        <div className="h-serif" style={{ fontSize: '2rem', marginTop: 4, color: '#fff' }}>
          Rp{total.toLocaleString('id-ID')}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.88rem', color: 'var(--grocery-hero-muted)' }}>
          {totalCount} barang di list · {pantryCount} sudah tercatat di dapur
        </p>
        <div
          className="progress-track"
          style={{ marginTop: 16, background: 'rgba(255,255,255,0.15)', height: 10, borderRadius: 999 }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${cartProgress}%`,
              background: 'var(--accent)',
              borderRadius: 999,
            }}
          />
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.8rem', color: 'var(--grocery-hero-muted)' }}>
          {checkedCount} dari {totalCount || 1} sudah dicentang (keranjang)
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--grocery-hero-muted)', lineHeight: 1.4 }}>
          Perkiraan dari harga per baris (bukan struk toko sebenarnya).
        </p>
      </div>

      <p className="belanja-section-kicker">Dikelompokin per kategori</p>

      {!listLoading && totalCount === 0 && !listError ? (
        <div className="hifi-card belanja-empty-wrap" style={{ marginTop: 0, padding: 0, overflow: 'hidden' }}>
          <NutriaEmptyState
            title="Belum ada isi untuk minggu ini"
            body="Tambah barang di bawah, atau isi Rencana dengan resep lalu rangkum ke sini — baris mengikuti bahan yang tergenerate."
            illustration={<IllustrationEmptyCart />}
            ctaLabel="Tambah barang"
            onCta={scrollToAdd}
            secondaryLabel="Buka Rencana"
            onSecondary={() => goToTab('rencana')}
          />
        </div>
      ) : null}

      {editingId ? (
        <div className="hifi-card tab-module-form" style={{ marginTop: 0, border: '2px solid var(--accent-soft)' }}>
          <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
            Ubah barang
          </h3>
          <form onSubmit={saveEdit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
            <FormField label="Nama barang" fieldId="g-edit-name">
              <input id="g-edit-name" className="input" value={editName} onChange={(ev) => setEditName(ev.target.value)} />
            </FormField>
            <FormField label="Kategori" fieldId="g-edit-sec">
              <select id="g-edit-sec" className="input" value={editSection} onChange={(ev) => setEditSection(ev.target.value)}>
                <option value="produce">Sayur & buah</option>
                <option value="meat">Protein</option>
                <option value="dairy">Susu & telur</option>
                <option value="frozen">Beku</option>
                <option value="pantry">Sembako</option>
                <option value="other">Lainnya</option>
              </select>
            </FormField>
            <FormField
              label="Jumlah / catatan"
              hint="Contoh: 2 ikat, 1 kg, untuk sup"
              fieldId="g-edit-qty"
            >
              <input id="g-edit-qty" className="input" value={editQtyText} onChange={(ev) => setEditQtyText(ev.target.value)} aria-describedby="g-edit-qty-hint" />
            </FormField>
            <FormField label="Perkiraan harga (IDR)" hint="Kira-kira di pasar untuk satu baris ini" fieldId="g-edit-price">
              <input
                id="g-edit-price"
                className="input"
                value={editPrice}
                onChange={(ev) => setEditPrice(ev.target.value)}
                inputMode="numeric"
                aria-describedby="g-edit-price-hint"
              />
            </FormField>
            {editError ? (
              <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }} role="alert">
                {editError}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" type="submit" style={{ flex: 1 }}>
                Simpan
              </button>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={cancelEdit}>
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {totalCount > 0
        ? grouped.map(([sec, rows]) => {
        const meta = sectionMeta(sec);
        const open = openMap[sec] !== false;
        const checked = rows.filter((r) => r.checked).length;
        const secTotal = rows.filter((r) => !r.checked).reduce((s, r) => s + (Number(r.priceIdrPerUnit) || 0), 0);
        return (
          <div key={sec} className="hifi-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => toggleSection(sec)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: meta.tint,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                }}
              >
                {meta.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="h-serif" style={{ fontSize: '1.02rem' }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {checked}/{rows.length} · Rp{secTotal.toLocaleString('id-ID')}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{open ? '⌃' : '⌄'}</span>
            </button>
            {open ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--border-soft)' }}>
                {rows.map((it) => {
                  const id = String(it.id);
                  const checkedIt = Boolean(it.checked);
                  return (
                    <li
                      key={id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border-soft)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => void toggle(id, checkedIt)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: checkedIt ? 999 : 6,
                          border: checkedIt ? 'none' : '2px solid var(--border)',
                          background: checkedIt ? 'var(--sage-deep)' : 'transparent',
                          cursor: 'pointer',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                        aria-label={checkedIt ? 'Batal centang keranjang' : 'Centang bila barang sudah di keranjang'}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="h-serif"
                          style={{
                            fontSize: '1.02rem',
                            textDecoration: checkedIt ? 'line-through' : 'none',
                            opacity: checkedIt ? 0.65 : 1,
                          }}
                        >
                          {String(it.name)}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          {it.qtyText ? String(it.qtyText) : '—'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          className="h-serif"
                          style={{
                            fontSize: '0.95rem',
                            textDecoration: checkedIt ? 'line-through' : 'none',
                          }}
                        >
                          {it.priceIdrPerUnit != null
                            ? `Rp${Number(it.priceIdrPerUnit).toLocaleString('id-ID')}`
                            : '—'}
                        </div>
                        <button type="button" className="btn-inline" onClick={() => startEdit(it)}>
                          Ubah
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })
        : null}

      <p className="belanja-section-kicker">Nambah barang baru</p>
      <div ref={addFormRef} className="hifi-card tab-module-form" style={{ marginTop: 0 }}>
        <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
          Isi detailnya
        </h3>
        <form onSubmit={addItem} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
          <FormField label="Nama barang" hint="Contoh: Bayam, Dada ayam fillet" fieldId="g-add-name">
            <input id="g-add-name" className="input" value={name} onChange={(ev) => setName(ev.target.value)} aria-describedby="g-add-name-hint" />
          </FormField>
          <FormField label="Kategori" fieldId="g-add-sec">
            <select id="g-add-sec" className="input" value={section} onChange={(ev) => setSection(ev.target.value)}>
              <option value="produce">Sayur & buah</option>
              <option value="meat">Protein</option>
              <option value="dairy">Susu & telur</option>
              <option value="frozen">Beku</option>
              <option value="pantry">Sembako</option>
              <option value="other">Lainnya</option>
            </select>
          </FormField>
          <FormField
            label="Jumlah / catatan"
            hint="Contoh: 2 ikat, 500 g, untuk 3 hari"
            fieldId="g-add-qty"
          >
            <input id="g-add-qty" className="input" value={qtyText} onChange={(ev) => setQtyText(ev.target.value)} aria-describedby="g-add-qty-hint" />
          </FormField>
          <FormField label="Perkiraan harga (IDR)" hint="Angka aja — total mingguan ada di atas" fieldId="g-add-price">
            <input
              id="g-add-price"
              className="input"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              inputMode="numeric"
              placeholder="contoh: 45000"
              aria-describedby="g-add-price-hint"
            />
          </FormField>
          {addError ? (
            <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }} role="alert">
              {addError}
            </div>
          ) : null}
          <button className="btn-primary" type="submit">
            Masukin ke list
          </button>
        </form>
      </div>
    </div>
  );
}
