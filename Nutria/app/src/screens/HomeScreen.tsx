import type { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeAlertTone } from '../domain/depletion';
import { buildPrepNudges } from '../domain/nudges';
import { useHomeData } from '../hooks/useHomeData';
import { colors } from '../theme/config';
import type { HomeNav } from './home/HomeLayouts';
import { CompactLayout, DepletionLayout, PlannerPeekLayout } from './home/HomeLayouts';
import { HomeHero } from './home/HomeHero';

function alertTone(
  avgRemaining: number,
  low: number,
  crit: number,
): 'ok' | 'warn' | 'crit' {
  if (avgRemaining <= crit) return 'crit';
  if (avgRemaining <= low) return 'warn';
  return 'ok';
}

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { data } = useHomeData();

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  const itemsForNudge = data.items.map((i) => ({
    remaining: i.remaining_grams,
    total: i.total_cooked_grams,
  }));
  const nudges = buildPrepNudges(itemsForNudge);
  const tone = homeAlertTone(
    data.avgRemaining,
    data.settings.lowThresholdPct,
    data.settings.criticalThresholdPct,
  );

  const common = {
    avgRemaining: data.avgRemaining,
    items: data.items,
    nudges,
    weekMeals: data.weekMeals,
    alertTone: tone,
    navigation,
  };

  let body: ReactNode;
  switch (data.settings.homeLayout) {
    case 'planner':
      body = <PlannerPeekLayout {...common} />;
      break;
    case 'compact':
      body = <CompactLayout {...common} />;
      break;
    case 'depletion':
    default:
      body = <DepletionLayout {...common} />;
      break;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <HomeHero />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
});
