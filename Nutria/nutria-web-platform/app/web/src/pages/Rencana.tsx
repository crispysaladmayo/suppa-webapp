import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { RencanaFinalizeCard } from '../components/RencanaFinalizeCard.js';
import { RencanaInsightCard } from '../components/RencanaInsightCard.js';
import { RencanaMealDayList } from '../components/RencanaMealDayList.js';
import { RencanaMealForm } from '../components/RencanaMealForm.js';
import { RencanaWeekDayStrip } from '../components/RencanaWeekDayStrip.js';
import { RencanaWeekSummaryCard } from '../components/RencanaWeekSummaryCard.js';
import { ConflictOrErrorBanner } from '../components/ConflictBanner.js';
import {
  IllustrationEmptyPlate,
  NutriaEmptyState,
} from '../components/NutriaEmptyState.js';
import { RencanaSkeleton } from '../components/PageLoadSkeleton.js';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadBusy, setLoadBusy] = useState(true);
  /** One successful fetch per `weekStart` so refetches after “Simpan” do not swap the page for a skeleton. */
  const [weekListReady, setWeekListReady] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [finalizeBusy, setFinalizeBusy] = useState(false);
  const [bootstrapNote, setBootstrapNote] = useState<string | null>(null);

  async function load() {
    setLoadBusy(true);
    setLoadError(null);
    try {
      const [m, p] = await Promise.all([api.meals(weekStart), api.persons()]);
      setMeals(m.meals);
      setPersons(p.persons);
      if (!personId && p.persons[0]?.id) setPersonId(String(p.persons[0].id));
    } catch (e) {
      log.error('rencana_load_failed', { err: String(e) });
      setLoadError('Rencana minggu belum kebuka — cek koneksi kamu, terus coba lagi ya.');
    } finally {
      setLoadBusy(false);
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
    setWeekListReady(false);
  }, [weekStart]);

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
          setBootstrapNote(`Nutria udah nyalin ${res.cloned} menu ke minggu yang kamu buka.`);
        } else {
          setBootstrapNote('Minggu barunya udah kebuka — yuk isi menu dari sini, pelan-pelan juga gak apa-apa.');
        }
        setWeekStart(p.targetWeek);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Minggunya belum kebuka — refresh halaman dulu ya, terus coba lagi.',
        );
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
        title: 'Udah siap jadi list belanja',
        sub: 'Semua menu udah ada makro & resepnya — tinggal finalisasi di bawah, Bun',
      };
    }
    if (noMacro === 0) {
      return {
        badge: Math.min(3, noRecipe || 1),
        title: 'Yuk lengkapi resepnya biar belanja keisi sendiri',
        sub:
          noRecipe === 1
            ? 'Masih 1 menu yang belum nempel ke resep Nutria'
            : `Masih ${noRecipe} menu yang belum nempel ke resep Nutria`,
      };
    }
    return {
      badge,
      title: 'Kalori & proteinnya dirapikan dikit ya',
      sub:
        noMacro === 1
          ? '1 menu belum ada angka kalori/protein — ketuk buat lihat saran langkahnya'
          : `${noMacro} menu belum ada angka kalori/protein — ketuk buat lihat saran langkahnya`,
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
      setBootstrapNote(`Nutria udah nambahin ${res.itemsAdded} baris belanja dari resep ke list kamu.`);
      goToTab('belanja');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'List belanjanya belum kebikin — cek resepnya dulu, terus coba lagi ya.',
      );
    } finally {
      setFinalizeBusy(false);
    }
  }

  if (loadBusy && !weekListReady && !loadError) {
    return (
      <div>
        <p className="eyebrow">{weekRangeLabel(weekStart)}</p>
        <div className="fab-row">
          <h1 className="screen-title" style={{ flex: 1 }}>
            Rencana minggu
          </h1>
        </div>
        <RencanaSkeleton />
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow">{weekRangeLabel(weekStart)}</p>
      <div className="fab-row">
        <h1 className="screen-title" style={{ flex: 1 }}>
          Rencana minggu
        </h1>
        <button type="button" className="btn-icon" aria-label="Tambah menu — geser ke form" onClick={scrollToForm}>
          +
        </button>
      </div>
      <p className="tab-hero-lede">
        Pilih harinya, tambah menu, sambil nempelin resep kalau perlu — satu alur buat seminggu penuh, biar
        gak pusing bolak-balik.
      </p>

      {loadError ? (
        <ConflictOrErrorBanner
          error={new Error(loadError)}
          onRefresh={() => void load()}
        />
      ) : null}

      {bootstrapNote ? (
        <div
          className="hifi-card"
          style={{ marginTop: 14, background: 'var(--tag-fresh-bg)', borderColor: 'transparent' }}
        >
          <p style={{ margin: 0, fontSize: '0.88rem' }}>{bootstrapNote}</p>
        </div>
      ) : null}

      <div className="tab-module-focus">
        <p className="tab-module-kicker">Mau lihat hari yang mana?</p>
        <RencanaWeekDayStrip
          weekStart={weekStart}
          dayIndex={dayIndex}
          setDayIndex={setDayIndex}
          mealCountByDay={mealCountByDay}
        />
        <button type="button" className="link-quiet" onClick={() => setWeekStart(startOfWeekSunday())}>
          Balik ke minggu yang lagi jalan
        </button>
      </div>

      <h2 className="tab-day-heading">{dayFullName(dayIndex)}</h2>
      <p className="tab-day-sub">
        Ini menu buat hari yang kamu pilih · waktu makan bisa diganti pas nambah menu di form bawah
      </p>

      {groupedSlots.length === 0 ? (
        <div className="hifi-card" style={{ marginTop: 10, padding: 0, overflow: 'hidden' }}>
          <NutriaEmptyState
            title={`${dayFullName(dayIndex)} masih kosong nih`}
            body="Yuk mulai dari form di bawah — sarapan, makan siang, atau camilan bisa kamu pilih dulu sebelum simpan."
            illustration={<IllustrationEmptyPlate />}
            ctaLabel="Isi menu yuk"
            onCta={scrollToForm}
          />
        </div>
      ) : (
        <RencanaMealDayList groupedSlots={groupedSlots} persons={persons} />
      )}

      <div className="tab-meta-stack">
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
      </div>

      <RencanaInsightCard insight={insight} insightOpen={insightOpen} setInsightOpen={setInsightOpen} />

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
