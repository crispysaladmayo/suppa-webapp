import { FormEvent, RefObject, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { MealFreshPrepSection } from './MealFreshPrepSection.js';
import { MealMacroFields } from './MealMacroFields.js';
import { MealPortionSection } from './MealPortionSection.js';
import { MealSlotPersonFields } from './MealSlotPersonFields.js';
import { RecipeIngredientBlock } from './RecipeIngredientBlock.js';
import { RecipeTitleSuggest } from './RecipeTitleSuggest.js';

function numOrNull(s: string): number | null {
  const t = s.trim();
  if (t === '') return null;
  const n = Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function buildMealNotes(takaran: string, jumlahPorsi: string, catatan: string): string | null {
  const parts: string[] = [];
  if (takaran.trim()) parts.push(`Takaran: ${takaran.trim()}`);
  const jp = Number(jumlahPorsi.replace(',', '.'));
  if (Number.isFinite(jp) && jp > 0) {
    parts.push(jp === 1 ? '1 porsi' : `${jp} porsi`);
  }
  if (catatan.trim()) parts.push(catatan.trim());
  return parts.length ? parts.join(' · ') : null;
}

type Slot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type Props = {
  formRef: RefObject<HTMLDivElement | null>;
  weekStart: string;
  dayIndex: number;
  slot: Slot;
  setSlot: (s: Slot) => void;
  persons: Array<Record<string, unknown>>;
  personId: string;
  setPersonId: (id: string) => void;
  prepItemOptions: Array<Record<string, unknown>>;
  onMealSaved: () => void;
};

export function RencanaMealForm({
  formRef,
  weekStart,
  dayIndex,
  slot,
  setSlot,
  persons,
  personId,
  setPersonId,
  prepItemOptions,
  onMealSaved,
}: Props) {
  const [title, setTitle] = useState('');
  const [takaran, setTakaran] = useState('');
  const [jumlahPorsi, setJumlahPorsi] = useState('1');
  const [catatan, setCatatan] = useState('');
  const [isFresh, setIsFresh] = useState(true);
  const [linkedPrepItemId, setLinkedPrepItemId] = useState('');
  const [kcal, setKcal] = useState('');
  const [proteinG, setProteinG] = useState('');
  const [carbsG, setCarbsG] = useState('');
  const [fatG, setFatG] = useState('');
  const [fiberG, setFiberG] = useState('');
  const [ironMg, setIronMg] = useState('');
  const [calciumMg, setCalciumMg] = useState('');
  const [vitaminCMg, setVitaminCMg] = useState('');

  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Array<Record<string, unknown>>>([]);
  const [ingredientRows, setIngredientRows] = useState<Array<{ name: string; grams: string }>>([
    { name: '', grams: '' },
  ]);
  const [saveAsRecipe, setSaveAsRecipe] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipeLocked = selectedRecipeId != null;

  useEffect(() => {
    const t = title.trim();
    if (t.length < 2 || recipeLocked) {
      setSuggestions([]);
      return;
    }
    const id = window.setTimeout(() => {
      void (async () => {
        try {
          const r = await api.recipeSearch(t, 10);
          setSuggestions(r.recipes);
        } catch {
          setSuggestions([]);
        }
      })();
    }, 300);
    return () => window.clearTimeout(id);
  }, [title, recipeLocked]);

  function resetForm() {
    setTitle('');
    setTakaran('');
    setJumlahPorsi('1');
    setCatatan('');
    setKcal('');
    setProteinG('');
    setCarbsG('');
    setFatG('');
    setFiberG('');
    setIronMg('');
    setCalciumMg('');
    setVitaminCMg('');
    setIsFresh(true);
    setLinkedPrepItemId('');
    setSelectedRecipeId(null);
    setIngredientRows([{ name: '', grams: '' }]);
    setSaveAsRecipe(false);
    setSuggestions([]);
  }

  async function pickRecipe(id: string) {
    setError(null);
    try {
      const d = await api.recipeDetail(id);
      setSelectedRecipeId(id);
      setTitle(String(d.recipe.title));
      setKcal(d.recipe.kcal != null ? String(d.recipe.kcal) : '');
      setProteinG(d.recipe.proteinG != null ? String(d.recipe.proteinG) : '');
      setCarbsG(d.recipe.carbsG != null ? String(d.recipe.carbsG) : '');
      setFatG(d.recipe.fatG != null ? String(d.recipe.fatG) : '');
      setFiberG(d.recipe.fiberG != null ? String(d.recipe.fiberG) : '');
      setIronMg(d.recipe.ironMg != null ? String(d.recipe.ironMg) : '');
      setCalciumMg(d.recipe.calciumMg != null ? String(d.recipe.calciumMg) : '');
      const v = d.micros?.vitaminCMg;
      setVitaminCMg(v != null ? String(v) : '');
      setIngredientRows(
        d.ingredients.map((x) => ({
          name: String(x.name),
          grams: String(x.grams),
        })),
      );
      setSaveAsRecipe(false);
      setSuggestions([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat resep');
    }
  }

  function clearRecipe() {
    setSelectedRecipeId(null);
    setIngredientRows([{ name: '', grams: '' }]);
  }

  async function addMeal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Isi nama makanan.');
      return;
    }
    setBusy(true);
    try {
      let recipeId: string | null = selectedRecipeId;
      if (saveAsRecipe && !selectedRecipeId) {
        const ings = ingredientRows.filter((r) => r.name.trim() && numOrNull(r.grams) != null);
        if (ings.length < 1) {
          setError('Untuk menyimpan resep baru, isi minimal satu bahan dan berat (gram).');
          setBusy(false);
          return;
        }
        const micros: Record<string, number> = {};
        const vc = numOrNull(vitaminCMg);
        if (vc != null) micros.vitaminCMg = vc;
        const created = await api.createRecipe({
          title: title.trim(),
          ingredients: ings.map((r, i) => ({
            name: r.name.trim(),
            grams: Number(numOrNull(r.grams)),
            sortOrder: i,
          })),
          kcal: numOrNull(kcal),
          proteinG: numOrNull(proteinG),
          carbsG: numOrNull(carbsG),
          fatG: numOrNull(fatG),
          fiberG: numOrNull(fiberG),
          ironMg: numOrNull(ironMg),
          calciumMg: numOrNull(calciumMg),
          micros: Object.keys(micros).length ? micros : undefined,
        });
        recipeId = String(created.recipe.id);
      }

      const notes = buildMealNotes(takaran, jumlahPorsi, catatan);
      const body: Record<string, unknown> = {
        weekStart,
        dayIndex,
        slot,
        personId,
        title: title.trim(),
        isFresh,
        notes: notes ?? null,
        kcal: numOrNull(kcal),
        proteinG: numOrNull(proteinG),
        carbsG: numOrNull(carbsG),
        fatG: numOrNull(fatG),
        fiberG: numOrNull(fiberG),
        ironMg: numOrNull(ironMg),
        calciumMg: numOrNull(calciumMg),
        recipeId: recipeId ?? null,
      };
      if (!isFresh && linkedPrepItemId) {
        body.prepItemId = linkedPrepItemId;
      } else {
        body.prepItemId = null;
      }
      await api.createMeal(body);
      resetForm();
      onMealSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hifi-card" ref={formRef} style={{ marginTop: 8 }}>
      <h3 className="h-serif" style={{ fontSize: '1.1rem' }}>
        Catat menu & resep
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>
        Ketik nama: pilih resep Nutria yang sudah ada, atau isi bahan lalu simpan sebagai resep baru
        (bisa dipakai ulang oleh keluarga lain). Menu dengan resep dipakai untuk menghitung belanja.
      </p>
      <form onSubmit={addMeal} style={{ display: 'grid', gap: 14, marginTop: 14 }}>
        <div className="form-section-title">Dasar</div>
        <RecipeTitleSuggest
          title={title}
          setTitle={setTitle}
          busy={busy}
          recipeLocked={recipeLocked}
          suggestions={suggestions}
          onPickRecipe={(id) => void pickRecipe(id)}
          onClearRecipe={clearRecipe}
        />
        <MealSlotPersonFields
          slot={slot}
          setSlot={setSlot}
          persons={persons}
          personId={personId}
          setPersonId={setPersonId}
        />

        <MealPortionSection
          takaran={takaran}
          setTakaran={setTakaran}
          jumlahPorsi={jumlahPorsi}
          setJumlahPorsi={setJumlahPorsi}
          catatan={catatan}
          setCatatan={setCatatan}
        />

        <RecipeIngredientBlock
          recipeLocked={recipeLocked}
          busy={busy}
          ingredientRows={ingredientRows}
          setIngredientRows={setIngredientRows}
          saveAsRecipe={saveAsRecipe}
          setSaveAsRecipe={setSaveAsRecipe}
        />

        <MealFreshPrepSection
          isFresh={isFresh}
          setIsFresh={setIsFresh}
          linkedPrepItemId={linkedPrepItemId}
          setLinkedPrepItemId={setLinkedPrepItemId}
          prepItemOptions={prepItemOptions}
        />

        <MealMacroFields
          kcal={kcal}
          setKcal={setKcal}
          proteinG={proteinG}
          setProteinG={setProteinG}
          carbsG={carbsG}
          setCarbsG={setCarbsG}
          fatG={fatG}
          setFatG={setFatG}
          fiberG={fiberG}
          setFiberG={setFiberG}
          ironMg={ironMg}
          setIronMg={setIronMg}
          calciumMg={calciumMg}
          setCalciumMg={setCalciumMg}
          vitaminCMg={vitaminCMg}
          setVitaminCMg={setVitaminCMg}
        />

        {error ? <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</div> : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          Simpan ke rencana
        </button>
      </form>
    </div>
  );
}
