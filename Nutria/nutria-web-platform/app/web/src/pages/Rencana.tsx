import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { RencanaFinalizeCard } from '../components/RencanaFinalizeCard.js';
import { RencanaInsightCard } from '../components/RencanaInsightCard.js';
import { RencanaMealDayList } from '../components/RencanaMealDayList.js';
import { RencanaMealForm } from '../components/RencanaMealForm.js';
import { RencanaWeekDayStrip } from '../components/RencanaWeekDayStrip.js';
import { RencanaWeekSummaryCard } from '../components/RencanaWeekSummaryCard.js';
import { dayFullName, weekRangeLabel } from '../lib/formatId.js';
import { startOfWeekSunday } from '../lib/week.js';
import { log } from '../logger.js';
import { useTabNav } from '../navigation/TabNavContext.js';

const SLOT_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export function Rencana() {
  const { goToTab } = useTabNav();
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [weekStart, setWeekStart] = useState(startOfWeekSunday());
  const [dayIndex, setDayIndex] = useState(() => new Date().getDay());
  const [meals, setMeals] = useState<Array<Record<string, unknown>>>([]);
  const [persons, setPersons] = useState<Array<Record<string, unknown>>>([]);
  const [prepItemOptions, setPrepItemOptions] = useState<Array<Record<string, unknown>>>([]);
  const [slot, setSlot] = useState<(typeof SLOT_ORDER)[number]>('breakfast');
  const [personId, setPersonId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [insightOpen, setInsightOpen] = useState(false);
  const [finalizeBusy, setFinalizeBusy] = useState(false);
  const [bootstrapNote, setBootstrapNote] = useState<string | null>(null);

  async function load() {
    try {
      const [m, p] = await Promise.all([api.meals(weekStart), api.persons()]);
      setMeals(m.meals);
      setPersons(p.persons);
      if (!personId && p.persons[0]?.id) setPersonId(String(p.persons[0].id));
    } catch (e) {
      log.error('rencana_load_failed', { err: String(e) });
      setError('Gagal memuat rencana');
    }
  }

  async function loadPrepItems() {
    try {
      const r = await api.prepRuns();
      const active = r.prepRuns.find((x) => String(x.status) === 'active');
      if (!active) {
        setPrepItemOptions([]);
        return;
      }
      const pi = await api.prepItems(String(active.id));
      setPrepItemOptions(pi.prepItems);
    } catch {
      setPrepItemOptions([]);
    }
  }

  useEffect(() => {
    void load();
  }, [weekStart]);

  useEffect(() => {
    void loadPrepItems();
  }, [weekStart]);

  useEffect(() => {
    const raw = sessionStorage.getItem('nutria.plan.bootstrap');
    if (!raw) return;
    sessionStorage.removeItem('nutria.plan.bootstrap');
    void (async () => {
      try {
        const p = JSON.parse(raw) as {
          mode?: string;
          targetWeek?: string;
          sourceWeek?: string;
          replaceExisting?: boolean;
        };
        if (!p.targetWeek) return;
        if (p.mode === 'reuse' && p.sourceWeek) {
          const res = await api.cloneWeekMeals({
            fromWeekStart: p.sourceWeek,
            toWeekStart: p.targetWeek,
            replaceExisting: Boolean(p.replaceExisting),
          });
          setBootstrapNote(`Disalin ${res.cloned} menu ke minggu tujuan.`);
        } else {
          setBootstrapNote('Minggu tujuan dibuka — mulai catat menu dari kosong.');
        }
        setWeekStart(p.targetWeek);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal menyiapkan minggu');
      }
    })();
  }, []);

  useEffect(() => {
    const fd = sessionStorage.getItem('nutria.plan.focusDay');
    if (fd != null) {
      sessionStorage.removeItem('nutria.plan.focusDay');
      const i = Number(fd);
      if (Number.isInteger(i) && i >= 0 && i <= 6) setDayIndex(i);
    }
    const v = sessionStorage.getItem('nutria.plan.openSummary');
    if (!v) return;
    sessionStorage.removeItem('nutria.plan.openSummary');
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [weekStart, meals.length]);

  const filtered = useMemo(
    () => meals.filter((m) => Number(m.dayIndex) === dayIndex),
    [meals, dayIndex],
  );

  const groupedSlots = useMemo(() => {
    const m = new Map<string, Array<Record<string, unknown>>>();
    for (const s of SLOT_ORDER) m.set(s, []);
    for (const meal of filtered) {
      const sl = String(meal.slot);
      if (!m.has(sl)) m.set(sl, []);
      m.get(sl)!.push(meal);
    }
    return SLOT_ORDER.map((s) => [s, m.get(s)!] as const).filter(([, list]) => list.length > 0);
  }, [filtered]);

  const insight = useMemo(() => {
    const week = meals;
    const noMacro = week.filter((x) => x.kcal == null || x.proteinG == null).length;
    const badge = Math.min(3, Math.max(1, noMacro || 1));
    const noRecipe = week.filter((x) => !x.recipeId).length;
    if (noMacro === 0 && noRecipe === 0) {
      return {
        badge: 0,
        title: 'Rencana siap dihitung belanja',
        sub: 'Semua menu punya makro & resep · finalisasi di bawah',
      };
    }
    if (noMacro === 0) {
      return {
        badge: Math.min(3, noRecipe || 1),
        title: 'Hubungkan resep untuk belanja otomatis',
        sub: `${noRecipe} menu belum punya resep Nutria`,
      };
    }
    return {
      badge,
      title: 'Lengkapi data makro',
      sub: `${noMacro} menu belum ada kkal/protein · ketuk untuk detail`,
    };
  }, [meals]);

  const mealCountByDay = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0, 0];
    for (const m of meals) {
      const di = Number(m.dayIndex);
      if (di >= 0 && di <= 6) c[di] += 1;
    }
    return c;
  }, [meals]);

  const recipeBacked = useMemo(() => meals.filter((m) => m.recipeId).length, [meals]);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function finalizePlan() {
    setFinalizeBusy(true);
    setError(null);
    try {
      const res = await api.groceryFromPlan({ weekStart, replaceGenerated: true });
      setBootstrapNote(`Belanja: ${res.itemsAdded} baris dari resep ditambahkan.`);
      goToTab('belanja');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat belanja');
    } finally {
      setFinalizeBusy(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">{weekRangeLabel(weekStart)}</p>
      <div className="fab-row">
        <h2 className="screen-title" style={{ flex: 1 }}>
          Rencana minggu
        </h2>
        <button type="button" className="btn-icon" aria-label="Tambah menu" onClick={scrollToForm}>
          +
        </button>
      </div>

      {bootstrapNote ? (
        <div
          className="hifi-card"
          style={{ marginTop: 10, background: 'var(--tag-fresh-bg)', borderColor: 'transparent' }}
        >
          <p style={{ margin: 0, fontSize: '0.88rem' }}>{bootstrapNote}</p>
        </div>
      ) : null}

      <RencanaWeekSummaryCard
        summaryRef={summaryRef}
        weekStart={weekStart}
        mealsTotal={meals.length}
        recipeBacked={recipeBacked}
        mealCountByDay={mealCountByDay}
      />

      <RencanaFinalizeCard
        recipeBacked={recipeBacked}
        finalizeBusy={finalizeBusy}
        error={error}
        onFinalize={() => void finalizePlan()}
      />

      <RencanaInsightCard insight={insight} insightOpen={insightOpen} setInsightOpen={setInsightOpen} />

      <RencanaWeekDayStrip weekStart={weekStart} dayIndex={dayIndex} setDayIndex={setDayIndex} />

      <button
        type="button"
        className="btn-ghost"
        style={{ marginBottom: 14, fontSize: '0.82rem' }}
        onClick={() => setWeekStart(startOfWeekSunday())}
      >
        Lompat ke minggu ini
      </button>

      <h3 className="h-serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>
        {dayFullName(dayIndex)}
      </h3>

      <RencanaMealDayList groupedSlots={groupedSlots} persons={persons} />

      <RencanaMealForm
        formRef={formRef}
        weekStart={weekStart}
        dayIndex={dayIndex}
        slot={slot}
        setSlot={setSlot}
        persons={persons}
        personId={personId}
        setPersonId={setPersonId}
        prepItemOptions={prepItemOptions}
        onMealSaved={() => void load()}
      />
    </div>
  );
}
