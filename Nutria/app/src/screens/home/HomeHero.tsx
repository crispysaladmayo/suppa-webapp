import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { NutriaLogo } from '../../components/NutriaLogo';
import { cardShadow, colors, radius, spacing } from '../../theme/config';
import { font } from '../../theme/fonts';

/**
 * Matches the splash block in Design/Nutria-share (1).html:
 * diagonal sage gradient (#EAE4D6 → #D8CDB3), terracotta mark with “N”, wordmark + subtitle.
 */
export function HomeHero() {
  return (
    <LinearGradient
      colors={[colors.sage1, colors.sage2]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, cardShadow]}
    >
      <NutriaLogo size={88} showDesignRing />
      <Text style={styles.wordmark}>Nutria</Text>
      <Text style={styles.tagline}>Meal prep planner</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  wordmark: {
    fontFamily: font.displayItalic,
    fontSize: 28,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontFamily: font.body,
    fontSize: 15,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
});
