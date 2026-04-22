import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, SchedulableTriggerInputTypes } from 'expo-notifications';
import {
  loadDepletionNotifyState,
  saveDepletionNotifyState,
  type DepletionNotifyState,
} from '../data/depletionNotifyStore';
import { log } from '../logger';

const CHANNEL_ID = 'depletion';

function toneRank(t: DepletionNotifyState['tone']): number {
  return t === 'ok' ? 0 : t === 'warn' ? 1 : 2;
}

let channelReady = false;
let handlerReady = false;

function ensureForegroundHandler(): void {
  if (handlerReady || Platform.OS === 'web') return;
  handlerReady = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) return;
  channelReady = true;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Prep depletion',
    importance: AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    description: 'Alerts when prepped food is running low.',
  });
}

async function requestPermissionIfNeeded(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

function bodyForTone(tone: 'warn' | 'crit'): string {
  if (tone === 'crit') {
    return 'Prepped food is critically low. Plan groceries or a new prep run.';
  }
  return 'Prepped food is getting low. Check your week and grocery list.';
}

export async function syncDepletionNotifications(
  db: SQLiteDatabase,
  input: { prepRunId: string | null; tone: DepletionNotifyState['tone'] },
): Promise<void> {
  if (Platform.OS === 'web') return;

  ensureForegroundHandler();
  await ensureAndroidChannel();

  const granted = await requestPermissionIfNeeded();
  if (!granted) {
    log.info('depletion_notify_skipped_no_permission');
    return;
  }

  const prev = await loadDepletionNotifyState(db);

  if (!prev) {
    await saveDepletionNotifyState(db, {
      prepRunId: input.prepRunId,
      tone: input.tone,
    });
    return;
  }

  if (prev.prepRunId !== input.prepRunId) {
    await saveDepletionNotifyState(db, {
      prepRunId: input.prepRunId,
      tone: input.tone,
    });
    return;
  }

  if (toneRank(input.tone) > toneRank(prev.tone)) {
    if (input.tone === 'warn' || input.tone === 'crit') {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Nutria — prep stock',
            body: bodyForTone(input.tone),
          },
          trigger:
            Platform.OS === 'android'
              ? {
                  type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                  seconds: 1,
                  channelId: CHANNEL_ID,
                }
              : null,
        });
        log.info('depletion_notify_sent', { tone: input.tone });
      } catch (e) {
        log.warn('depletion_notify_schedule_failed', { err: String(e) });
      }
    }
  }

  await saveDepletionNotifyState(db, {
    prepRunId: input.prepRunId,
    tone: input.tone,
  });
}
