import {
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_600SemiBold,
  Lora_600SemiBold_Italic,
  useFonts,
} from '@expo-google-fonts/lora';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrate } from './db/migrate';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './theme/config';

/**
 * SQLiteProvider (non-suspense) returns `null` until the DB is open, which produced a blank
 * screen during init. useSuspense + Suspense shows an explicit fallback instead.
 *
 * Fonts load in the background — never block navigation on custom fonts.
 */
export default function NutriaApp() {
  useFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_600SemiBold,
    Lora_600SemiBold_Italic,
  });

  return (
    <GestureHandlerRootView style={styles.root}>
      <Suspense fallback={<BootSpinner />}>
        <SQLiteProvider useSuspense databaseName="nutria.db" onInit={migrate}>
          <StatusBar style="dark" />
          <RootNavigator />
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}

function BootSpinner() {
  return (
    <View style={styles.boot} testID="db-boot-spinner">
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
