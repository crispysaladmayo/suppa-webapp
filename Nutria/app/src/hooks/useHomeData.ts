import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getActivePrepRun, getPrepItems, type PrepItemRow } from '../data/prepStore';
import { loadSettings } from '../data/settingsStore';
import { defaultSettings, type SettingsPayload } from '../schemas/settings';
import { listMealsForWeek, type MealRow } from '../data/mealStore';
import { weekStartISO } from '../utils/date';
import { averageRemainingRatio, homeAlertTone } from '../domain/depletion';
import { syncDepletionNotifications } from '../services/depletionNotifications';
import { log } from '../logger';

export type HomeData = {
  settings: SettingsPayload;
  items: PrepItemRow[];
  avgRemaining: number;
  weekMeals: MealRow[];
  weekStart: string;
};

export function useHomeData() {
  const db = useSQLiteContext();
  const [data, setData] = useState<HomeData | null>(null);

  const refresh = useCallback(async () => {
    try {
      const settings = await loadSettings(db);
      const run = await getActivePrepRun(db);
      const items = run ? await getPrepItems(db, run.id) : [];
      const ratios = items.map((i) => ({
        remaining: i.remaining_grams,
        total: i.total_cooked_grams,
      }));
      const avgRemaining = averageRemainingRatio(ratios);
      const weekStart = weekStartISO();
      const weekMeals = await listMealsForWeek(db, weekStart);
      const tone = homeAlertTone(
        avgRemaining,
        settings.lowThresholdPct,
        settings.criticalThresholdPct,
      );
      setData({ settings, items, avgRemaining, weekMeals, weekStart });
      try {
        await syncDepletionNotifications(db, { prepRunId: run?.id ?? null, tone });
      } catch (e) {
        log.warn('depletion_notifications_sync_failed', { err: String(e) });
      }
    } catch (e) {
      log.warn('home_refresh_failed', { err: String(e) });
      const weekStart = weekStartISO();
      setData({
        settings: defaultSettings,
        items: [],
        avgRemaining: 1,
        weekMeals: [],
        weekStart,
      });
    }
  }, [db]);

  // useFocusEffect alone can miss the first paint on the initial tab; mount run avoids infinite spinner.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { data, refresh };
}
