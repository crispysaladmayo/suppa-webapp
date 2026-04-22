import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
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
import {
  estimatedTotalIdr,
  insertGrocery,
  listGrocery,
  normalizeSection,
  toggleGrocery,
  type GroceryRow,
} from '../data/groceryStore';
import { listPantry, type PantryRow } from '../data/pantryStore';
import { GroceryFormSchema } from '../schemas/grocery';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';
import { weekStartISO } from '../utils/date';
import { formatIDR } from '../utils/money';
import { log } from '../logger';

function groupBySection(rows: GroceryRow[]): Record<string, GroceryRow[]> {
  return rows.reduce<Record<string, GroceryRow[]>>((acc, r) => {
    const k = r.section;
    if (!acc[k]) acc[k] = [];
    acc[k].push(r);
    return acc;
  }, {});
}

export function GroceryScreen() {
  const db = useSQLiteContext();
  const weekStart = weekStartISO();
  const [rows, setRows] = useState<GroceryRow[]>([]);
  const [pantry, setPantry] = useState<PantryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [section, setSection] = useState('produce');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const load = useCallback(async () => {
    const g = await listGrocery(db, weekStart);
    const p = await listPantry(db);
    setRows(g);
    setPantry(p);
    setLoading(false);
  }, [db, weekStart]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const grouped = useMemo(() => groupBySection(rows), [rows]);
  const total = useMemo(() => estimatedTotalIdr(rows), [rows]);

  const save = async () => {
    try {
      const parsed = GroceryFormSchema.parse({
        name: name.trim(),
        section: normalizeSection(section),
        qty_text: qty.trim() || undefined,
        price_idr_per_unit: price ? Number(price) : undefined,
      });
      await insertGrocery(
        db,
        weekStart,
        parsed.name,
        parsed.section,
        parsed.qty_text ?? null,
        parsed.price_idr_per_unit ?? null,
      );
      setName('');
      setQty('');
      setPrice('');
      setModal(false);
      await load();
    } catch (e) {
      log.warn('grocery_save_invalid', { err: String(e) });
    }
  };

  const onCheck = async (id: string, checked: boolean) => {
    await toggleGrocery(db, id, !checked);
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
        <Text style={styles.h1}>Grocery · {weekStart}</Text>
        <Text style={styles.total}>Unchecked estimate: {formatIDR(total)}</Text>
        <Text style={styles.h2}>Pantry (already have)</Text>
        <View style={styles.card}>
          {pantry.map((p) => (
            <Text key={p.id} style={styles.pantryLine}>
              {p.name} · ~{p.qty_guess}
              {p.unit_note} · {p.price_idr_per_unit != null ? formatIDR(p.price_idr_per_unit) : '—'}
            </Text>
          ))}
        </View>
        {Object.keys(grouped).length === 0 ? (
          <Text style={styles.muted}>No grocery lines yet — add from your plan.</Text>
        ) : (
          Object.entries(grouped).map(([sec, list]) => (
            <View key={sec} style={styles.sectionBlock}>
              <Text style={styles.secTitle}>{sec}</Text>
              {list.map((r) => (
                <Pressable
                  key={r.id}
                  style={styles.gRow}
                  onPress={() => void onCheck(r.id, !!r.checked)}
                >
                  <Text style={[styles.check, r.checked ? styles.checkOn : undefined]}>
                    {r.checked ? '✓' : '○'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.gName, r.checked ? styles.gNameDone : undefined]}
                    >{`${r.name}${r.qty_text ? ` · ${r.qty_text}` : ''}`}</Text>
                    <Text style={styles.gMeta}>
                      {r.price_idr_per_unit != null
                        ? formatIDR(r.price_idr_per_unit)
                        : 'set price in edit'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))
        )}
        <Pressable style={styles.fab} onPress={() => setModal(true)}>
          <Text style={styles.fabTxt}>+ Add item</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add grocery line</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
            <Text style={styles.label}>Section</Text>
            <View style={styles.row}>
              {['produce', 'meat', 'dairy', 'pantry', 'frozen', 'other'].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSection(s)}
                  style={[styles.chip, section === s && styles.chipOn]}
                >
                  <Text style={section === s ? styles.chipTxtOn : styles.chipTxt}>{s}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Qty note</Text>
            <TextInput value={qty} onChangeText={setQty} placeholder="e.g. 500g" style={styles.input} />
            <Text style={styles.label}>Price (IDR per line item est.)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModal(false)} style={styles.cancel}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => void save()} style={styles.save}>
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
  scroll: { padding: spacing.lg, paddingBottom: 120 },
  h1: { fontFamily: font.displayItalic, fontSize: 24, color: colors.text },
  h2: {
    fontFamily: font.display,
    fontSize: 16,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  total: { fontFamily: font.display, fontSize: 16, color: colors.accent, marginVertical: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  pantryLine: { fontSize: 14, color: colors.text, marginBottom: 6 },
  muted: { color: colors.textMuted },
  sectionBlock: { marginBottom: spacing.lg },
  secTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  gRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  check: { fontSize: 20, width: 28, color: colors.textMuted },
  checkOn: { color: colors.success },
  gName: { fontSize: 16, color: colors.text },
  gNameDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  gMeta: { fontSize: 13, color: colors.textMuted },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  fabTxt: { color: colors.surface, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
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
