import { FormField } from './FormField.js';

type Props = {
  isFresh: boolean;
  setIsFresh: (v: boolean) => void;
  linkedPrepItemId: string;
  setLinkedPrepItemId: (v: string) => void;
  prepItemOptions: Array<Record<string, unknown>>;
};

export function MealFreshPrepSection({
  isFresh,
  setIsFresh,
  linkedPrepItemId,
  setLinkedPrepItemId,
  prepItemOptions,
}: Props) {
  return (
    <>
      <div className="form-section-title">Sumber makanan</div>
      <FormField
        label="Segar atau dari prep?"
        hint="Menu dari prep mengurangi stok batch yang Anda hubungkan"
        fieldId="meal-fresh"
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={isFresh ? 'btn-primary' : 'btn-ghost'}
            style={{ flex: 1, minWidth: 120 }}
            onClick={() => {
              setIsFresh(true);
              setLinkedPrepItemId('');
            }}
          >
            Segar
          </button>
          <button
            type="button"
            className={!isFresh ? 'btn-primary' : 'btn-ghost'}
            style={{ flex: 1, minWidth: 120 }}
            onClick={() => setIsFresh(false)}
          >
            Prep
          </button>
        </div>
      </FormField>
      {!isFresh ? (
        <FormField label="Hubungkan ke item prep (opsional)" fieldId="meal-prep-link">
          <select
            id="meal-prep-link"
            className="input"
            value={linkedPrepItemId}
            onChange={(ev) => setLinkedPrepItemId(ev.target.value)}
          >
            <option value="">— Tidak memilih —</option>
            {prepItemOptions.map((pi) => (
              <option key={String(pi.id)} value={String(pi.id)}>
                {String(pi.name)}
              </option>
            ))}
          </select>
        </FormField>
      ) : null}
    </>
  );
}
