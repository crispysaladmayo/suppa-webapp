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
      <div className="form-section-title">Bahan untuk resep</div>
      <p className="recipe-ingredient-hint">
        {recipeLocked
          ? 'Ini bahan dari resep Nutria. Mau ubah? lepas dulu resepnya, nanti bisa disimpan jadi variasi baru.'
          : 'Tiap baris: satu bahan + berat total (gram) buat hidangan ini. Kalau diisi rapi, Nutria simpan jadi resep baru pas kamu pencet simpan (nama makanannya enaknya beda biar gak ketuker).'}
      </p>
      {ingredientRows.map((row, idx) => (
        <div key={idx} className="ingredient-row">
          <input
            className="input"
            placeholder="misal: dada ayam fillet"
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
          + Bahan lagi
        </button>
      ) : null}
    </>
  );
}
