import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NButton } from '../components/NButton';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';

const STEPS = [
  'Clear counters · set out containers and labels.',
  'Weigh proteins raw; note expected cooked yield (25–30% loss for chicken).',
  'Portion for adults vs mark “fresh today” meals for your daughter in the planner.',
  'Cool quickly, then fridge in shallow containers.',
  'Update the prep run in Settings when the batch is packed.',
];

export function PrepModeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Prep mode</Text>
        <Text style={styles.lead}>
          A calm checklist before a big cook — stay in the “make food for the week” mindset.
        </Text>
        <View style={styles.card}>
          {STEPS.map((line, i) => (
            <View key={line} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumTxt}>{i + 1}</Text>
              </View>
              <Text style={styles.stepTxt}>{line}</Text>
            </View>
          ))}
        </View>
        <NButton title="Done" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },
  h1: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, fontStyle: 'italic' },
  lead: { fontSize: 16, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  stepRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sage1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumTxt: { fontWeight: '700', color: colors.text, fontSize: 14 },
  stepTxt: { flex: 1, fontFamily: font.body, fontSize: 16, color: colors.text, lineHeight: 22 },
});
