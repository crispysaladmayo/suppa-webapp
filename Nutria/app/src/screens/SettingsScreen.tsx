import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { createPrepRun } from '../data/prepStore';
import { loadSettings, saveSettings } from '../data/settingsStore';
import { listMealsForWeek } from '../data/mealStore';
import { listGrocery } from '../data/groceryStore';
import { shareWeekPlan } from '../export/shareWeek';
import { rawNeededForCooked } from '../domain/yield';
import { HomeLayoutSchema, type SettingsPayload } from '../schemas/settings';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';
import { weekStartISO } from '../utils/date';
import { log } from '../logger';

export function SettingsScreen() {
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(true);
  const [s, setS] = useState<SettingsPayload | null>(null);
  const [low, setLow] = useState('20');
  const [crit, setCrit] = useState('10');
  const [layout, setLayout] = useState<'depletion' | 'planner' | 'compact'>('depletion');
  const [runName, setRunName] = useState('Next batch');
  const [cookedA, setCookedA] = useState('1000');
  const [yieldA, setYieldA] = useState('27.5');
  const [nameA, setNameA] = useState('Chicken (prepped)');
  const [cookedB, setCookedB] = useState('800');
  const [yieldB, setYieldB] = useState('25');
  const [nameB, setNameB] = useState('Minced beef (prepped)');
  const [cookedTarget, setCookedTarget] = useState('725');
  const [lossPct, setLossPct] = useState('27.5');
  const [rawHint, setRawHint] = useState('');

  const load = useCallback(async () => {
    const st = await loadSettings(db);
    setS(st);
    setLow(String(Math.round(st.lowThresholdPct * 100)));
    setCrit(String(Math.round(st.criticalThresholdPct * 100)));
    setLayout(st.homeLayout);
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const persist = async () => {
    try {
      const next: SettingsPayload = {
        lowThresholdPct: Number(low) / 100,
        criticalThresholdPct: Number(crit) / 100,
        homeLayout: HomeLayoutSchema.parse(layout),
      };
      await saveSettings(db, next);
      setS(next);
      log.info('settings_saved', { layout: next.homeLayout });
    } catch (e) {
      log.warn('settings_invalid', { err: String(e) });
    }
  };

  const startPrepRun = async () => {
    try {
      const items = [
        {
          name: nameA.trim(),
          totalCookedGrams: Number(cookedA),
          cookYieldPct: Number(yieldA),
        },
        {
          name: nameB.trim(),
          totalCookedGrams: Number(cookedB),
          cookYieldPct: Number(yieldB),
        },
      ].filter((x) => x.name.length > 0 && x.totalCookedGrams > 0);
      if (!items.length) return;
      await createPrepRun(db, runName.trim() || 'Prep run', items);
      log.info('prep_run_created', { items: items.length });
      await load();
    } catch (e) {
      log.warn('prep_run_failed', { err: String(e) });
    }
  };

  const share = async () => {
    const ws = weekStartISO();
    const meals = await listMealsForWeek(db, ws);
    const g = await listGrocery(db, ws);
    await shareWeekPlan(ws, meals, g);
  };

  const calcRaw = () => {
    const c = Number(cookedTarget);
    const l = Number(lossPct);
    if (!c || l < 0 || l > 60) {
      setRawHint('');
      return;
    }
    const raw = rawNeededForCooked(c, l);
    setRawHint(`Buy ~${Math.round(raw)}g raw for ~${c}g cooked (${l}% loss).`);
  };

  if (loading || !s) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Settings</Text>
        <Text style={styles.h2}>Depletion alerts</Text>
        <Text style={styles.label}>Low threshold (% remaining)</Text>
        <TextInput value={low} onChangeText={setLow} keyboardType="numeric" style={styles.input} />
        <Text style={styles.label}>Critical threshold (% remaining)</Text>
        <TextInput value={crit} onChangeText={setCrit} keyboardType="numeric" style={styles.input} />
        <Text style={styles.h2}>Home layout</Text>
        <View style={styles.row}>
          {(['depletion', 'planner', 'compact'] as const).map((l) => (
            <Pressable key={l} onPress={() => setLayout(l)} style={[styles.chip, layout === l && styles.chipOn]}>
              <Text style={layout === l ? styles.chipTxtOn : styles.chipTxt}>{l}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.save} onPress={() => void persist()}>
          <Text style={styles.saveTxt}>Save preferences</Text>
        </Pressable>

        <Text style={styles.h2}>Cooking yield helper</Text>
        <Text style={styles.sub}>Chicken often loses ~25–30% weight after cooking.</Text>
        <TextInput
          value={cookedTarget}
          onChangeText={setCookedTarget}
          keyboardType="numeric"
          placeholder="Target cooked g"
          style={styles.input}
        />
        <TextInput
          value={lossPct}
          onChangeText={setLossPct}
          keyboardType="numeric"
          placeholder="Loss %"
          style={styles.input}
        />
        <Pressable style={styles.secondary} onPress={calcRaw}>
          <Text style={styles.secondaryTxt}>Estimate raw weight</Text>
        </Pressable>
        {rawHint ? <Text style={styles.hint}>{rawHint}</Text> : null}

        <Text style={styles.h2}>Start new prep run</Text>
        <Text style={styles.sub}>Archives the current active run and tracks a fresh batch.</Text>
        <TextInput value={runName} onChangeText={setRunName} style={styles.input} />
        <Text style={styles.label}>Item 1</Text>
        <TextInput value={nameA} onChangeText={setNameA} style={styles.input} />
        <View style={styles.rowGap}>
          <TextInput
            value={cookedA}
            onChangeText={setCookedA}
            keyboardType="numeric"
            placeholder="cooked g"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            value={yieldA}
            onChangeText={setYieldA}
            keyboardType="numeric"
            placeholder="loss %"
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <Text style={styles.label}>Item 2</Text>
        <TextInput value={nameB} onChangeText={setNameB} style={styles.input} />
        <View style={styles.rowGap}>
          <TextInput
            value={cookedB}
            onChangeText={setCookedB}
            keyboardType="numeric"
            placeholder="cooked g"
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            value={yieldB}
            onChangeText={setYieldB}
            keyboardType="numeric"
            placeholder="loss %"
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <Pressable style={styles.secondary} onPress={() => void startPrepRun()}>
          <Text style={styles.secondaryTxt}>Create prep run</Text>
        </Pressable>

        <Text style={styles.h2}>Share week</Text>
        <Pressable style={styles.secondary} onPress={() => void share()}>
          <Text style={styles.secondaryTxt}>Export plan + grocery (system share)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontFamily: font.displayItalic, fontSize: 24, color: colors.text, marginBottom: spacing.md },
  h2: {
    fontFamily: font.display,
    fontSize: 17,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sub: { fontFamily: font.body, color: colors.textMuted, marginBottom: spacing.sm, lineHeight: 20 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  rowGap: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTxt: { color: colors.text, textTransform: 'capitalize' },
  chipTxtOn: { color: colors.surface, fontWeight: '600', textTransform: 'capitalize' },
  save: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...cardShadow,
  },
  saveTxt: { fontFamily: font.display, color: colors.surface, fontSize: 16 },
  secondary: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  secondaryTxt: { fontFamily: font.display, color: colors.accent },
  hint: { color: colors.success, marginBottom: spacing.md, fontWeight: '600' },
});
