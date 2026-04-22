import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { insertGrocery, normalizeSection } from '../data/groceryStore';
import { insertMeal, deleteMeal, listMealsForWeek, type MealRow } from '../data/mealStore';
import { listPersons, type PersonRow } from '../data/personStore';
import { sumMacros } from '../domain/nutrition';
import { MealFormSchema } from '../schemas/meal';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';
import { dayLabel, weekStartISO } from '../utils/date';
import { log } from '../logger';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function guessSectionFromMealTitle(title: string): string {
  const t = title.toLowerCase();
  if (/chicken|beef|patty|minced|meat|fish|egg/.test(t)) return 'meat';
  if (/milk|yogurt|cheese|whey/.test(t)) return 'dairy';
  if (/corn|bean|greens|vegetable|salad|papaya|banana|potato|avo|oat/.test(t)) return 'produce';
  if (/frozen|ice/.test(t)) return 'frozen';
  return 'other';
}

export function PlannerScreen() {
  const db = useSQLiteContext();
  const weekStart = weekStartISO();
  const [meals, setMeals] = useState<MealRow[]>([]);
  const [persons, setPersons] = useState<PersonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>('lunch');
  const [personId, setPersonId] = useState('wife');
  const [title, setTitle] = useState('');
  const [fresh, setFresh] = useState(true);
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');

  const load = useCallback(async () => {
    const m = await listMealsForWeek(db, weekStart);
    const p = await listPersons(db);
    setMeals(m);
    setPersons(p);
    setLoading(false);
  }, [db, weekStart]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const dailyTotals = (di: number) => {
    const dayMeals = meals.filter((x) => x.day_index === di);
    return sumMacros(
      dayMeals.map((m) => ({
        kcal: m.kcal ?? undefined,
        protein_g: m.protein_g ?? undefined,
        carbs_g: m.carbs_g ?? undefined,
        fat_g: m.fat_g ?? undefined,
        fiber_g: m.fiber_g ?? undefined,
        iron_mg: m.iron_mg ?? undefined,
        calcium_mg: m.calcium_mg ?? undefined,
      })),
    );
  };

  const saveMeal = async () => {
    try {
      const parsed = MealFormSchema.parse({
        week_start: weekStart,
        day_index: day,
        slot,
        person_id: personId,
        title: title.trim(),
        is_fresh: fresh,
        kcal: kcal ? Number(kcal) : undefined,
        protein_g: protein ? Number(protein) : undefined,
      });
      await insertMeal(db, {
        week_start: parsed.week_start,
        day_index: parsed.day_index,
        slot: parsed.slot,
        person_id: parsed.person_id,
        title: parsed.title,
        is_fresh: parsed.is_fresh ? 1 : 0,
        prep_item_id: null,
        notes: null,
        kcal: parsed.kcal ?? null,
        protein_g: parsed.protein_g ?? null,
        carbs_g: null,
        fat_g: null,
        fiber_g: null,
        iron_mg: null,
        calcium_mg: null,
      });
      setTitle('');
      setKcal('');
      setProtein('');
      setModal(false);
      await load();
    } catch (e) {
      log.warn('meal_save_invalid', { err: String(e) });
    }
  };

  const remove = async (id: string) => {
    await deleteMeal(db, id);
    await load();
  };

  const addMealToGrocery = async (m: MealRow) => {
    const sec = normalizeSection(guessSectionFromMealTitle(m.title));
    await insertGrocery(db, weekStart, m.title, sec, `${m.slot} · ${m.person_id}`, null);
    await load();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Week of {weekStart}</Text>
        <Text style={styles.sub}>Tap a day to add meals. Snacks and daughter’s fresh plates can sit here too.</Text>
        {[0, 1, 2, 3, 4, 5, 6].map((di) => {
          const dMeals = meals.filter((m) => m.day_index === di);
          const t = dailyTotals(di);
          return (
            <View key={di} style={styles.dayCard}>
              <View style={styles.dayHead}>
                <Text style={styles.dayTitle}>{dayLabel(di)}</Text>
                <Pressable
                  style={styles.addBtn}
                  onPress={() => {
                    setDay(di);
                    setModal(true);
                  }}
                >
                  <Text style={styles.addBtnTxt}>+ Meal</Text>
                </Pressable>
              </View>
              <Text style={styles.macroHint}>
                Day est.: {Math.round(t.kcal)} kcal · {Math.round(t.protein_g)}g protein
              </Text>
              {dMeals.map((m) => (
                <View key={m.id} style={styles.mealRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealTitle}>
                      {m.slot} · {m.title}
                    </Text>
                    <Text style={styles.mealMeta}>
                      {m.person_id} · {m.is_fresh ? 'fresh' : 'prepped'}
                    </Text>
                  </View>
                  <Pressable onPress={() => void addMealToGrocery(m)} style={styles.groceryBtn}>
                    <Text style={styles.groceryBtnTxt}>Shop</Text>
                  </Pressable>
                  <Pressable onPress={() => void remove(m.id)}>
                    <Text style={styles.del}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add meal</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Chicken, corn, beans"
              style={styles.input}
            />
            <Text style={styles.label}>Slot</Text>
            <View style={styles.row}>
              {SLOTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSlot(s)}
                  style={[styles.chip, slot === s && styles.chipOn]}
                >
                  <Text style={slot === s ? styles.chipTxtOn : styles.chipTxt}>{s}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Person</Text>
            <View style={styles.row}>
              {persons.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setPersonId(p.id)}
                  style={[styles.chip, personId === p.id && styles.chipOn]}
                >
                  <Text style={personId === p.id ? styles.chipTxtOn : styles.chipTxt}>
                    {p.display_name}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setFresh(!fresh)} style={styles.row}>
              <Text style={styles.label}>Cooked fresh today</Text>
              <Text style={styles.toggle}>{fresh ? 'Yes' : 'No'}</Text>
            </Pressable>
            <Text style={styles.label}>Optional macros</Text>
            <View style={styles.rowGap}>
              <TextInput
                value={kcal}
                onChangeText={setKcal}
                keyboardType="numeric"
                placeholder="kcal"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="protein g"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModal(false)} style={styles.cancel}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => void saveMeal()} style={styles.save}>
                <Text style={styles.saveTxt}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontFamily: font.displayItalic, fontSize: 24, color: colors.text, marginBottom: spacing.xs },
  sub: {
    fontFamily: font.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  dayHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayTitle: { fontFamily: font.display, fontSize: 18, color: colors.text },
  addBtn: {
    backgroundColor: colors.sage1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  addBtnTxt: { color: colors.text, fontWeight: '600' },
  macroHint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
  mealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  groceryBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.sage1,
  },
  groceryBtnTxt: { fontSize: 13, fontWeight: '600', color: colors.accent },
  mealTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  mealMeta: { fontSize: 13, color: colors.textMuted },
  del: { fontSize: 18, color: colors.danger, paddingLeft: spacing.sm },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalTitle: { fontFamily: font.displayItalic, fontSize: 20, marginBottom: spacing.md, color: colors.text },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.bg,
    color: colors.text,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  rowGap: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTxt: { color: colors.text, textTransform: 'capitalize' },
  chipTxtOn: { color: colors.surface, fontWeight: '600', textTransform: 'capitalize' },
  toggle: { fontWeight: '600', color: colors.accent },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.md },
  cancel: { padding: spacing.md },
  cancelTxt: { color: colors.textMuted },
  save: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  saveTxt: { color: colors.surface, fontWeight: '700' },
});
