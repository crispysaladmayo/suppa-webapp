import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/config';
import type { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { PrepModeScreen } from '../screens/PrepModeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="PrepMode"
          component={PrepModeScreen}
          options={{ title: 'Prep mode', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
