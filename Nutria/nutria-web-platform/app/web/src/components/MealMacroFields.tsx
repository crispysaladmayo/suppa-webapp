import { FormField } from './FormField.js';

type Props = {
  kcal: string;
  setKcal: (v: string) => void;
  proteinG: string;
  setProteinG: (v: string) => void;
  carbsG: string;
  setCarbsG: (v: string) => void;
  fatG: string;
  setFatG: (v: string) => void;
  fiberG: string;
  setFiberG: (v: string) => void;
  ironMg: string;
  setIronMg: (v: string) => void;
  calciumMg: string;
  setCalciumMg: (v: string) => void;
  vitaminCMg: string;
  setVitaminCMg: (v: string) => void;
};

export function MealMacroFields({
  kcal,
  setKcal,
  proteinG,
  setProteinG,
  carbsG,
  setCarbsG,
  fatG,
  setFatG,
  fiberG,
  setFiberG,
  ironMg,
  setIronMg,
  calciumMg,
  setCalciumMg,
  vitaminCMg,
  setVitaminCMg,
}: Props) {
  return (
    <>
      <div className="form-section-title">Nutrisi & mikro (per porsi / perkiraan)</div>
      <FormField label="Energi (kkal)" fieldId="meal-kcal">
        <input
          id="meal-kcal"
          className="input"
          value={kcal}
          onChange={(ev) => setKcal(ev.target.value)}
          inputMode="decimal"
        />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Karbohidrat (g)" fieldId="meal-carbs">
          <input
            id="meal-carbs"
            className="input"
            value={carbsG}
            onChange={(ev) => setCarbsG(ev.target.value)}
            inputMode="decimal"
          />
        </FormField>
        <FormField label="Protein (g)" fieldId="meal-protein">
          <input
            id="meal-protein"
            className="input"
            value={proteinG}
            onChange={(ev) => setProteinG(ev.target.value)}
            inputMode="decimal"
          />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Lemak (g)" fieldId="meal-fat">
          <input id="meal-fat" className="input" value={fatG} onChange={(ev) => setFatG(ev.target.value)} inputMode="decimal" />
        </FormField>
        <FormField label="Serat (g)" fieldId="meal-fiber">
          <input id="meal-fiber" className="input" value={fiberG} onChange={(ev) => setFiberG(ev.target.value)} inputMode="decimal" />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Besi (mg, opsional)" fieldId="meal-iron">
          <input id="meal-iron" className="input" value={ironMg} onChange={(ev) => setIronMg(ev.target.value)} inputMode="decimal" />
        </FormField>
        <FormField label="Kalsium (mg, opsional)" fieldId="meal-calcium">
          <input
            id="meal-calcium"
            className="input"
            value={calciumMg}
            onChange={(ev) => setCalciumMg(ev.target.value)}
            inputMode="decimal"
          />
        </FormField>
      </div>
      <FormField
        label="Vitamin C (mg, opsional)"
        hint="Disimpan ke resep sebagai mikronutrien jika Anda menyimpan resep baru"
        fieldId="meal-vitc"
      >
        <input
          id="meal-vitc"
          className="input"
          value={vitaminCMg}
          onChange={(ev) => setVitaminCMg(ev.target.value)}
          inputMode="decimal"
        />
      </FormField>
    </>
  );
}
