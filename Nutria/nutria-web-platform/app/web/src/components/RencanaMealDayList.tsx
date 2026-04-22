const SLOT_LABEL: Record<string, string> = {
  breakfast: 'SARAPAN',
  lunch: 'MAKAN SIANG',
  dinner: 'MAKAN MALAM',
  snack: 'CAMILAN',
};

const MEAL_ICON: Record<string, string> = {
  breakfast: '🥤',
  lunch: '🍗',
  dinner: '🍲',
  snack: '🍌',
};

function initialOf(name: string): string {
  const t = name.trim();
  return t ? t[0]!.toUpperCase() : '?';
}

type Props = {
  groupedSlots: Array<readonly [string, Array<Record<string, unknown>>]>;
  persons: Array<Record<string, unknown>>;
};

export function RencanaMealDayList({ groupedSlots, persons }: Props) {
  if (groupedSlots.length === 0) {
    return (
      <div className="hifi-card" style={{ marginBottom: 14 }}>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Belum ada menu buat hari ini — yuk isi dari form di bawah.</p>
      </div>
    );
  }

  return (
    <>
      {groupedSlots.map(([sl, list]) => (
        <div key={sl} style={{ marginBottom: 18 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            {SLOT_LABEL[sl]} · {list.length}
          </p>
          {list.map((m) => {
            const pid = String(m.personId);
            const person = persons.find((p) => String(p.id) === pid);
            const who = String(person?.displayName ?? '?');
            const fresh = Boolean(m.isFresh);
            const kcalStr = m.kcal != null ? `${Math.round(Number(m.kcal))} kkal` : '—';
            const protStr = m.proteinG != null ? `${Math.round(Number(m.proteinG))}g prot` : '—';
            const carbStr = m.carbsG != null ? `${Math.round(Number(m.carbsG))}g karb` : '—';
            const fatStr = m.fatG != null ? `${Math.round(Number(m.fatG))}g lemak` : '—';
            return (
              <div className="hifi-card" key={String(m.id)} style={{ marginBottom: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: 'var(--canvas)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0,
                    }}
                  >
                    {MEAL_ICON[sl] ?? '🍽️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      {fresh ? <span className="tag-segar">segar</span> : <span className="tag-prep">prep</span>}
                      {m.recipeId ? (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'var(--sage-deep)',
                            color: '#fff',
                          }}
                        >
                          resep
                        </span>
                      ) : null}
                    </div>
                    <div className="h-serif" style={{ fontSize: '1.12rem', marginTop: 8 }}>
                      {String(m.title)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      {m.notes ? String(m.notes) : '—'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginTop: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {kcalStr} · {protStr} · {carbStr} · {fatStr}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <span
                      title={who}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        background: '#6b3d4a',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {initialOf(who)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
