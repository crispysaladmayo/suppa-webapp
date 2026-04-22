type Row = { name: string; grams: string };

type Props = {
  recipeLocked: boolean;
  busy: boolean;
  ingredientRows: Row[];
  setIngredientRows: (rows: Row[]) => void;
  saveAsRecipe: boolean;
  setSaveAsRecipe: (v: boolean) => void;
};

export function RecipeIngredientBlock({
  recipeLocked,
  busy,
  ingredientRows,
  setIngredientRows,
  saveAsRecipe,
  setSaveAsRecipe,
}: Props) {
  return (
    <>
      <div className="form-section-title">Bahan (resep)</div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
        {recipeLocked
          ? 'Bahan dari resep Nutria (baca saja). Untuk ubah, lepas resep lalu simpan resep baru.'
          : 'Tambah baris per bahan. Centang “simpan resep” untuk mengunggah ke Nutria.'}
      </p>
      {ingredientRows.map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 88px', gap: 8 }}>
          <input
            className="input"
            placeholder="Nama bahan"
            value={row.name}
            disabled={recipeLocked || busy}
            onChange={(ev) => {
              if (recipeLocked) return;
              const next = [...ingredientRows];
              next[idx] = { ...next[idx]!, name: ev.target.value };
              setIngredientRows(next);
            }}
          />
          <input
            className="input"
            placeholder="g"
            inputMode="decimal"
            value={row.grams}
            disabled={recipeLocked || busy}
            onChange={(ev) => {
              if (recipeLocked) return;
              const next = [...ingredientRows];
              next[idx] = { ...next[idx]!, grams: ev.target.value };
              setIngredientRows(next);
            }}
          />
        </div>
      ))}
      {!recipeLocked ? (
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setIngredientRows([...ingredientRows, { name: '', grams: '' }])}
        >
          + Bahan
        </button>
      ) : null}
      {!recipeLocked ? (
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.88rem' }}>
          <input
            type="checkbox"
            checked={saveAsRecipe}
            onChange={(ev) => setSaveAsRecipe(ev.target.checked)}
          />
          <span>Simpan sebagai resep Nutria (nama unik; bisa dipakai pengguna lain)</span>
        </label>
      ) : null}
    </>
  );
}
