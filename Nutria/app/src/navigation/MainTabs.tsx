import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { NutriaLogo } from '../components/NutriaLogo';
import { GroceryScreen } from '../screens/GroceryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LogScreen } from '../screens/LogScreen';
import { PlannerScreen } from '../screens/PlannerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, spacing } from '../theme/config';
import { font } from '../theme/fonts';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function tabIcon(route: keyof TabParamList, focused: boolean) {
  const color = focused ? colors.accent : colors.textMuted;
  const name = (() => {
    switch (route) {
      case 'Home':
        return focused ? 'home' : 'home-outline';
      case 'Planner':
        return focused ? 'calendar' : 'calendar-outline';
      case 'Grocery':
        return focused ? 'cart' : 'cart-outline';
      case 'Log':
        return focused ? 'restaurant' : 'restaurant-outline';
      case 'Settings':
        return focused ? 'settings' : 'settings-outline';
      default:
        return 'ellipse-outline' as const;
    }
  })();
  return <Ionicons name={name} size={24} color={color} />;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.bg,
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'left',
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <NutriaLogo size={32} />
            <Text
              style={{
                fontFamily: font.displayItalic,
                fontSize: 22,
                color: colors.text,
              }}
            >
              Nutria
            </Text>
          </View>
        ),
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: spacing.xs,
          height: 58,
        },
        tabBarLabelStyle: {
          fontFamily: font.body,
          fontSize: 11,
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => tabIcon(route.name as keyof TabParamList, focused),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: 'Week' }} />
      <Tab.Screen name="Grocery" component={GroceryScreen} options={{ title: 'Grocery' }} />
      <Tab.Screen name="Log" component={LogScreen} options={{ title: 'Log meal' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
