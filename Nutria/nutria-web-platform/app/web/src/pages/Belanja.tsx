import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { startOfWeekSunday } from '../lib/week.js';
import { log } from '../logger.js';

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
  const [weekStart] = useState(startOfWeekSunday());
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [total, setTotal] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [name, setName] = useState('Bayam');
  const [section, setSection] = useState('produce');
  const [price, setPrice] = useState('8000');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [g, p] = await Promise.all([api.grocery(weekStart), api.pantry()]);
      setItems(g.items);
      setTotal(g.totalIdrUnchecked);
      setPantryCount(p.items.length);
    } catch (e) {
      log.error('belanja_load_failed', { err: String(e) });
      setError('Gagal memuat belanja');
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

  async function addItem(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const priceIdr = price.trim() === '' ? null : Number(price);
      await api.createGrocery({
        weekStart,
        name,
        section,
        priceIdrPerUnit: Number.isFinite(priceIdr as number) ? priceIdr : null,
        checked: false,
      });
      setName('Bayam');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah');
    }
  }

  async function toggle(id: string, checked: boolean) {
    try {
      await api.patchGrocery(id, { checked: !checked });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update');
    }
  }

  function toggleSection(key: string) {
    setOpenMap((m) => ({ ...m, [key]: !(m[key] ?? true) }));
  }

  return (
    <div>
      <p className="eyebrow">Belanja mingguan</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 className="screen-title">Grocery</h2>
        <button
          type="button"
          className="btn-ghost"
          style={{ padding: '10px 12px', borderRadius: 12 }}
          aria-label="Filter"
        >
          ⚙
        </button>
      </div>

      <div
        style={{
          background: 'var(--grocery-hero)',
          color: 'var(--grocery-hero-text)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 20px 20px',
          marginTop: 14,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <p className="eyebrow" style={{ color: 'var(--grocery-hero-muted)' }}>
          Perkiraan total
        </p>
        <div className="h-serif" style={{ fontSize: '2rem', marginTop: 4, color: '#fff' }}>
          Rp{total.toLocaleString('id-ID')}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.88rem', color: 'var(--grocery-hero-muted)' }}>
          {totalCount} item belanja · {pantryCount} sudah ada di dapur
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
          {checkedCount} dari {totalCount || 1} sudah masuk keranjang
        </p>
      </div>

      {grouped.map(([sec, rows]) => {
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
                        aria-label={checkedIt ? 'Batal centang' : 'Centang'}
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
                      <div
                        className="h-serif"
                        style={{
                          fontSize: '0.95rem',
                          flexShrink: 0,
                          textDecoration: checkedIt ? 'line-through' : 'none',
                        }}
                      >
                        {it.priceIdrPerUnit != null
                          ? `Rp${Number(it.priceIdrPerUnit).toLocaleString('id-ID')}`
                          : '—'}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}

      <div className="hifi-card" style={{ marginTop: 14 }}>
        <h3 className="h-serif" style={{ fontSize: '1.05rem' }}>
          Tambah barang
        </h3>
        <form onSubmit={addItem} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <input className="input" value={name} onChange={(ev) => setName(ev.target.value)} />
          <select className="input" value={section} onChange={(ev) => setSection(ev.target.value)}>
            <option value="produce">Sayur & buah</option>
            <option value="meat">Protein</option>
            <option value="dairy">Susu & telur</option>
            <option value="frozen">Beku</option>
            <option value="pantry">Sembako</option>
            <option value="other">Lainnya</option>
          </select>
          <input className="input" value={price} onChange={(ev) => setPrice(ev.target.value)} placeholder="Harga IDR" />
          {error ? <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</div> : null}
          <button className="btn-primary" type="submit">
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
}
