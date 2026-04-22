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
import { addConsumption, getActivePrepRun, getPrepItems, type PrepItemRow } from '../data/prepStore';
import { listPersons, type PersonRow } from '../data/personStore';
import { ConsumptionFormSchema } from '../schemas/consumption';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';
import { log } from '../logger';

export function LogScreen() {
  const db = useSQLiteContext();
  const [persons, setPersons] = useState<PersonRow[]>([]);
  const [items, setItems] = useState<PrepItemRow[]>([]);
  const [personId, setPersonId] = useState('wife');
  const [prepItemId, setPrepItemId] = useState<string | null>(null);
  const [grams, setGrams] = useState('150');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const p = await listPersons(db);
    const run = await getActivePrepRun(db);
    const its = run ? await getPrepItems(db, run.id) : [];
    setPersons(p);
    setItems(its);
    setPrepItemId((prev) => (prev && its.some((i) => i.id === prev) ? prev : its[0]?.id ?? null));
    setLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const submit = async () => {
    setMsg(null);
    try {
      const parsed = ConsumptionFormSchema.parse({
        prep_item_id: prepItemId ?? '',
        person_id: personId,
        grams: Number(grams),
      });
      await addConsumption(db, parsed.prep_item_id, parsed.person_id, parsed.grams);
      setMsg('Logged. Remaining stock updated.');
      await load();
    } catch (e) {
      log.warn('consumption_invalid', { err: String(e) });
      setMsg('Check grams and selections.');
    }
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
        <Text style={styles.h1}>Log prepped meal</Text>
        <Text style={styles.sub}>
          Subtracts from your active prep run so depletion stays accurate.
        </Text>
        {items.length === 0 ? (
          <Text style={styles.warn}>No prep items — add a prep run in Settings.</Text>
        ) : null}
        <Text style={styles.label}>Who ate</Text>
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
        <Text style={styles.label}>Prep item</Text>
        <View style={styles.row}>
          {items.map((it) => (
            <Pressable
              key={it.id}
              onPress={() => setPrepItemId(it.id)}
              style={[styles.chip, prepItemId === it.id && styles.chipOn]}
            >
              <Text style={prepItemId === it.id ? styles.chipTxtOn : styles.chipTxt} numberOfLines={1}>
                {it.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Grams (cooked weight)</Text>
        <TextInput
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
          style={styles.input}
        />
        <Pressable style={styles.save} onPress={() => void submit()}>
          <Text style={styles.saveTxt}>Save log</Text>
        </Pressable>
        {msg ? <Text style={styles.msg}>{msg}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  h1: { fontFamily: font.displayItalic, fontSize: 24, color: colors.text, marginBottom: spacing.xs },
  sub: { fontFamily: font.body, color: colors.textMuted, marginBottom: spacing.lg, lineHeight: 20 },
  warn: { color: colors.danger, marginBottom: spacing.md },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 18,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '100%',
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTxt: { color: colors.text },
  chipTxtOn: { color: colors.surface, fontWeight: '600' },
  save: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    ...cardShadow,
  },
  saveTxt: { fontFamily: font.display, color: colors.surface, fontSize: 16 },
  msg: { marginTop: spacing.md, color: colors.success, fontWeight: '600' },
});
