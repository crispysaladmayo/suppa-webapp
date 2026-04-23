import type { NutritionTotals } from '../lib/estimateFromIngredients.js';

type Props = {
  recipeLocked: boolean;
  /** Per serving / per log (after portion split when estimated). */
  values: NutritionTotals | null;
  unmatchedIngredientNames: string[];
  portionsNote: string;
};

export function MealMacroSummary({ recipeLocked, values, unmatchedIngredientNames, portionsNote }: Props) {
  return (
    <div className="macro-summary">
      <div className="form-section-title">Ringkasan gizi (kira-kira)</div>
      <p className="macro-summary__lede">
        {recipeLocked
          ? 'Angka mengikuti resep Nutria yang dipilih — bukan isi manual.'
          : 'Dari bahan + tabel komposisi pangan; untuk gambaran sehari-hari, bukan saran klinis.'}
      </p>
      {values ? (
        <>
          <p className="macro-summary__portion">{portionsNote}</p>
          <dl className="macro-summary__grid">
            <div>
              <dt>Energi</dt>
              <dd>{values.kcal} kkal</dd>
            </div>
            <div>
              <dt>Protein</dt>
              <dd>{values.proteinG} g</dd>
            </div>
            <div>
              <dt>Karbo</dt>
              <dd>{values.carbsG} g</dd>
            </div>
            <div>
              <dt>Lemak</dt>
              <dd>{values.fatG} g</dd>
            </div>
            <div>
              <dt>Serat</dt>
              <dd>{values.fiberG} g</dd>
            </div>
            <div>
              <dt>Besi / Ca / Vit C</dt>
              <dd>
                {values.ironMg} mg · {values.calciumMg} mg · {values.vitaminCMg} mg
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="macro-summary__empty">
          {recipeLocked
            ? 'Resep ini belum ada angka makro yang tersimpan.'
            : 'Isi minimal satu bahan + beratnya (gram) — nanti Nutria bantu hitung perkiraannya.'}
        </p>
      )}
      {!recipeLocked && unmatchedIngredientNames.length > 0 ? (
        <p className="macro-summary__warn" role="status">
          {unmatchedIngredientNames.length} bahan belum cocok di tabel (
          {unmatchedIngredientNames.slice(0, 4).join(', ')}
          {unmatchedIngredientNames.length > 4 ? '…' : ''}) — total bisa lebih rendah dari aslinya.
        </p>
      ) : null}
    </div>
  );
}
