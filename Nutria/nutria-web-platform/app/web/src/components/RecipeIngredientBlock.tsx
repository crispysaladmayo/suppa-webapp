type Row = { name: string; grams: string };

type Props = {
  recipeLocked: boolean;
  busy: boolean;
  ingredientRows: Row[];
  setIngredientRows: (rows: Row[]) => void;
};

export function RecipeIngredientBlock({ recipeLocked, busy, ingredientRows, setIngredientRows }: Props) {
  return (
    <>
      <div className="form-section-title">Bahan (resep)</div>
      <p className="recipe-ingredient-hint">
        {recipeLocked
          ? 'Bahan dari resep Nutria. Lepas resep untuk mengedit atau menyimpan variasi baru.'
          : 'Setiap baris: satu bahan dan berat total (gram) untuk hidangan ini. Jika diisi, Nutria menyimpan resep baru saat Anda menekan simpan (nama makanan sebaiknya unik).'}
      </p>
      {ingredientRows.map((row, idx) => (
        <div key={idx} className="ingredient-row">
          <input
            className="input"
            placeholder="contoh: Dada ayam fillet"
            value={row.name}
            disabled={recipeLocked || busy}
            onChange={(ev) => {
              if (recipeLocked) return;
              const next = [...ingredientRows];
              next[idx] = { ...next[idx]!, name: ev.target.value };
              setIngredientRows(next);
            }}
            aria-label={`Bahan ${idx + 1}`}
          />
          <input
            className="input ingredient-row__g"
            placeholder="contoh: 200"
            inputMode="decimal"
            value={row.grams}
            disabled={recipeLocked || busy}
            onChange={(ev) => {
              if (recipeLocked) return;
              const next = [...ingredientRows];
              next[idx] = { ...next[idx]!, grams: ev.target.value };
              setIngredientRows(next);
            }}
            aria-label={`Berat bahan ${idx + 1} dalam gram`}
          />
        </div>
      ))}
      {!recipeLocked ? (
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setIngredientRows([...ingredientRows, { name: '', grams: '' }])}
        >
          + Tambah bahan
        </button>
      ) : null}
    </>
  );
}
