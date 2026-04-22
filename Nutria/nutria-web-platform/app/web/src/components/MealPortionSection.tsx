import { FormField } from './FormField.js';

type Props = {
  takaran: string;
  setTakaran: (v: string) => void;
  jumlahPorsi: string;
  setJumlahPorsi: (v: string) => void;
  catatan: string;
  setCatatan: (v: string) => void;
};

export function MealPortionSection({
  takaran,
  setTakaran,
  jumlahPorsi,
  setJumlahPorsi,
  catatan,
  setCatatan,
}: Props) {
  return (
    <>
      <div className="form-section-title">Takaran & porsi</div>
      <FormField
        label="Takaran satu porsi"
        hint="Contoh: 1 gelas (300 ml), 1 mangkuk, 150 g dada ayam"
        fieldId="meal-takaran"
      >
        <input
          id="meal-takaran"
          className="input"
          value={takaran}
          onChange={(ev) => setTakaran(ev.target.value)}
          aria-describedby="meal-takaran-hint"
        />
      </FormField>
      <FormField
        label="Jumlah porsi"
        hint="Berapa kali takaran di atas (mis. 2 = dua gelas)"
        fieldId="meal-porsi"
      >
        <input
          id="meal-porsi"
          className="input"
          value={jumlahPorsi}
          onChange={(ev) => setJumlahPorsi(ev.target.value)}
          inputMode="decimal"
          aria-describedby="meal-porsi-hint"
        />
      </FormField>
      <FormField
        label="Catatan tambahan"
        hint="Bahan lain, cara masak, atau sumber resep"
        fieldId="meal-catatan"
      >
        <textarea
          id="meal-catatan"
          className="input"
          rows={2}
          value={catatan}
          onChange={(ev) => setCatatan(ev.target.value)}
          aria-describedby="meal-catatan-hint"
        />
      </FormField>
    </>
  );
}
