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
    <div className="recipe-title-field">
      <FormField
        label="Nama makanan"
        hint="Ketik untuk mencari resep Nutria, atau nama baru bila membuat resep sendiri."
        fieldId="meal-title"
      >
        <input
          id="meal-title"
          className="input recipe-title-field__input"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          autoComplete="off"
          aria-describedby="meal-title-hint"
          aria-autocomplete="list"
          aria-expanded={!recipeLocked && suggestions.length > 0}
          disabled={busy}
        />
      </FormField>
      {recipeLocked ? (
        <button type="button" className="btn-inline recipe-title-field__unlink" onClick={onClearRecipe}>
          Lepas resep · edit manual
        </button>
      ) : null}
      {!recipeLocked && suggestions.length > 0 ? (
        <ul className="recipe-suggest-panel" role="listbox" aria-label="Resep Nutria yang cocok">
          {suggestions.map((s) => (
            <li key={String(s.id)} role="none">
              <button
                type="button"
                role="option"
                className="recipe-suggest-item"
                onClick={() => onPickRecipe(String(s.id))}
              >
                <span className="recipe-suggest-item__title">{String(s.title)}</span>
                <span className="recipe-suggest-item__meta">Resep Nutria · ketuk kalau mau dipakai</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
