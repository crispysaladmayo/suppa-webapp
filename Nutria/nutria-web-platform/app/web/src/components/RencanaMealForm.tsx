import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { estimateNutritionFromIngredients, scaleNutrition, type NutritionTotals } from '../lib/estimateFromIngredients.js';
import { MealFreshPrepSection } from './MealFreshPrepSection.js';
import { MealMacroSummary } from './MealMacroSummary.js';
import { MealPortionSection } from './MealPortionSection.js';
import { useToast } from '../context/ToastContext.js';
import { MealSlotPersonFields } from './MealSlotPersonFields.js';
import { RecipeIngredientBlock } from './RecipeIngredientBlock.js';
import { RecipeTitleSuggest } from './RecipeTitleSuggest.js';

function numOrNull(s: string): number | null {
  const t = s.trim();
  if (t === '') return null;
  const n = Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function nutritionFromLockedForm(
  kcal: string,
  proteinG: string,
  carbsG: string,
  fatG: string,
  fiberG: string,
  ironMg: string,
  calciumMg: string,
  vitaminCMg: string,
): NutritionTotals | null {
  const k = numOrNull(kcal);
  const p = numOrNull(proteinG);
  const c = numOrNull(carbsG);
  const f = numOrNull(fatG);
  const fi = numOrNull(fiberG);
  const i = numOrNull(ironMg);
  const ca = numOrNull(calciumMg);
  const v = numOrNull(vitaminCMg);
  if (k == null && p == null && c == null && f == null && fi == null && i == null && ca == null && v == null) {
    return null;
  }
  return {
    kcal: Math.round(k ?? 0),
    proteinG: round1(p ?? 0),
    carbsG: round1(c ?? 0),
    fatG: round1(f ?? 0),
    fiberG: round1(fi ?? 0),
    ironMg: round1(i ?? 0),
    calciumMg: round1(ca ?? 0),
    vitaminCMg: round1(v ?? 0),
  };
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
  const { showToast } = useToast();
  const feedbackRef = useRef<HTMLDivElement>(null);
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<{ title: string; sub: string } | null>(null);

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

  useEffect(() => {
    if (!saveFeedback) return;
    const id = window.setTimeout(() => setSaveFeedback(null), 7000);
    return () => window.clearTimeout(id);
  }, [saveFeedback]);

  const validIngredientRows = useMemo(
    () => ingredientRows.filter((r) => r.name.trim() && numOrNull(r.grams) != null),
    [ingredientRows],
  );

  const estimateBreakdown = useMemo(
    () => estimateNutritionFromIngredients(ingredientRows),
    [ingredientRows],
  );

  const portionsFactor = Math.max(0.001, numOrNull(jumlahPorsi) ?? 1);

  const macroPresentation = useMemo(() => {
    if (recipeLocked) {
      return {
        values: nutritionFromLockedForm(
          kcal,
          proteinG,
          carbsG,
          fatG,
          fiberG,
          ironMg,
          calciumMg,
          vitaminCMg,
        ),
        unmatched: [] as string[],
        portionsNote: 'Per porsi ngikut data resep Nutria yang kamu pilih.',
      };
    }
    if (validIngredientRows.length === 0) {
      return {
        values: null as NutritionTotals | null,
        unmatched: estimateBreakdown.unmatched,
        portionsNote: '',
      };
    }
    const per = scaleNutrition(estimateBreakdown.total, 1 / portionsFactor);
    const hasMatch = estimateBreakdown.matched.length > 0;
    const portionsNote =
      portionsFactor === 1
        ? 'Perkiraan per 1 porsi (total bahan ÷ 1).'
        : `Perkiraan per porsi: total bahan ÷ ${portionsFactor}.`;
    return {
      values: hasMatch ? per : null,
      unmatched: estimateBreakdown.unmatched,
      portionsNote,
    };
  }, [
    recipeLocked,
    validIngredientRows.length,
    estimateBreakdown,
    portionsFactor,
    kcal,
    proteinG,
    carbsG,
    fatG,
    fiberG,
    ironMg,
    calciumMg,
    vitaminCMg,
  ]);

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
      setSuggestions([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resepnya belum kebuka — coba lagi ya.');
    }
  }

  function clearRecipe() {
    setSelectedRecipeId(null);
    setIngredientRows([{ name: '', grams: '' }]);
    setKcal('');
    setProteinG('');
    setCarbsG('');
    setFatG('');
    setFiberG('');
    setIronMg('');
    setCalciumMg('');
    setVitaminCMg('');
  }

  async function addMeal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaveFeedback(null);
    if (!title.trim()) {
      setError('Tulis nama makanannya dulu ya.');
      return;
    }
    setBusy(true);
    const savedTitle = title.trim();
    let createdNewRecipe = false;
    try {
      let recipeId: string | null = selectedRecipeId;
      let mealKcal = numOrNull(kcal);
      let mealProtein = numOrNull(proteinG);
      let mealCarbs = numOrNull(carbsG);
      let mealFat = numOrNull(fatG);
      let mealFiber = numOrNull(fiberG);
      let mealIron = numOrNull(ironMg);
      let mealCalcium = numOrNull(calciumMg);

      if (!selectedRecipeId && validIngredientRows.length >= 1) {
        const batch = estimateNutritionFromIngredients(
          validIngredientRows.map((r) => ({ name: r.name.trim(), grams: r.grams })),
        ).total;
        const micros: Record<string, number> = {};
        if (batch.vitaminCMg > 0) micros.vitaminCMg = batch.vitaminCMg;
        const created = await api.createRecipe({
          title: savedTitle,
          ingredients: validIngredientRows.map((r, i) => ({
            name: r.name.trim(),
            grams: Number(numOrNull(r.grams)),
            sortOrder: i,
          })),
          kcal: batch.kcal,
          proteinG: batch.proteinG,
          carbsG: batch.carbsG,
          fatG: batch.fatG,
          fiberG: batch.fiberG,
          ironMg: batch.ironMg,
          calciumMg: batch.calciumMg,
          micros: Object.keys(micros).length ? micros : undefined,
        });
        recipeId = String(created.recipe.id);
        createdNewRecipe = true;
        const per = scaleNutrition(batch, 1 / portionsFactor);
        mealKcal = per.kcal;
        mealProtein = per.proteinG;
        mealCarbs = per.carbsG;
        mealFat = per.fatG;
        mealFiber = per.fiberG;
        mealIron = per.ironMg;
        mealCalcium = per.calciumMg;
      }

      const notes = buildMealNotes(takaran, jumlahPorsi, catatan);
      const body: Record<string, unknown> = {
        weekStart,
        dayIndex,
        slot,
        personId,
        title: savedTitle,
        isFresh,
        notes: notes ?? null,
        kcal: mealKcal,
        proteinG: mealProtein,
        carbsG: mealCarbs,
        fatG: mealFat,
        fiberG: mealFiber,
        ironMg: mealIron,
        calciumMg: mealCalcium,
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
      const successTitle = createdNewRecipe
        ? 'Hore, resep barunya ke-save'
        : 'Menu udah masuk rencana';
      const successSub = createdNewRecipe
        ? `“${savedTitle}” sekarang ada di Nutria dan nempel ke menu ini. Mau dipakai lagi? tinggal ketik nama yang mirip.`
        : `“${savedTitle}” udah muncul di hari & waktu makan yang kamu pilih — tinggal lanjut isi hari lain kalau mau.`;
      setSaveFeedback({ title: successTitle, sub: successSub });
      const toastMsg = createdNewRecipe
        ? `Resep baru ke-save: ${savedTitle}`
        : `Menu ke-save: ${savedTitle}`;
      showToast(toastMsg, { durationMs: 5500 });
      window.requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Belum ke-save — coba lagi sebentar ya.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hifi-card tab-module-form" ref={formRef} style={{ marginTop: 8 }}>
      <h3 className="h-serif" style={{ fontSize: '1.1rem' }}>
        Tulis menu & resepnya
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>
        Ketik nama buat cari resep yang udah ada, atau isi bahan sendiri — Nutria bantu kira-kira nutrisinya
        dari tabel pangan Indonesia. Kalau bahannya lengkap, resep baru ke-save pas kamu pencet simpan.
      </p>
      <form onSubmit={addMeal} style={{ display: 'grid', gap: 14, marginTop: 14 }}>
        {saveFeedback ? (
          <div
            ref={feedbackRef}
            className="save-feedback save-feedback--success"
            role="status"
            aria-live="polite"
          >
            <p className="save-feedback__title">{saveFeedback.title}</p>
            <p className="save-feedback__sub">{saveFeedback.sub}</p>
          </div>
        ) : null}

        <div className="form-section-title">Yang penting dulu</div>
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
        />

        <MealFreshPrepSection
          isFresh={isFresh}
          setIsFresh={setIsFresh}
          linkedPrepItemId={linkedPrepItemId}
          setLinkedPrepItemId={setLinkedPrepItemId}
          prepItemOptions={prepItemOptions}
        />

        <MealMacroSummary
          recipeLocked={recipeLocked}
          values={macroPresentation.values}
          unmatchedIngredientNames={macroPresentation.unmatched}
          portionsNote={macroPresentation.portionsNote}
        />

        {error ? (
          <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }} role="alert">
            {error}
          </div>
        ) : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          Simpan ke rencana
        </button>
      </form>
    </div>
  );
}
