import { FormField } from './FormField.js';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  busy: boolean;
  recipeLocked: boolean;
  suggestions: Array<Record<string, unknown>>;
  onPickRecipe: (id: string) => void;
  onClearRecipe: () => void;
};

export function RecipeTitleSuggest({
  title,
  setTitle,
  busy,
  recipeLocked,
  suggestions,
  onPickRecipe,
  onClearRecipe,
}: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <FormField
        label="Nama makanan"
        hint="Mengetik akan mencari resep Nutria. Satu nama unik = satu resep di basis data."
        fieldId="meal-title"
      >
        <input
          id="meal-title"
          className="input"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          autoComplete="off"
          aria-describedby="meal-title-hint"
          disabled={busy}
        />
      </FormField>
      {recipeLocked ? (
        <button type="button" className="btn-inline" style={{ marginTop: 6 }} onClick={onClearRecipe}>
          Lepas resep · edit manual
        </button>
      ) : null}
      {!recipeLocked && suggestions.length > 0 ? (
        <ul
          className="hifi-card"
          style={{
            position: 'absolute',
            zIndex: 5,
            left: 0,
            right: 0,
            top: '100%',
            marginTop: 4,
            listStyle: 'none',
            padding: 8,
            maxHeight: 220,
            overflowY: 'auto',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {suggestions.map((s) => (
            <li key={String(s.id)}>
              <button
                type="button"
                onClick={() => onPickRecipe(String(s.id))}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                }}
              >
                <strong>{String(s.title)}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resep Nutria</div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
