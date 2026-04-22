import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { cardShadow, colors, radius, spacing } from '../theme/config';
import { font } from '../theme/fonts';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export function NButton({ title, onPress, variant = 'primary', style }: Props) {
  const bg =
    variant === 'primary'
      ? colors.accent
      : variant === 'secondary'
        ? colors.sage1
        : 'transparent';
  const fg =
    variant === 'primary' ? colors.surface : variant === 'secondary' ? colors.text : colors.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: pressed ? 0.88 : 1 },
        variant === 'primary' && cardShadow,
        variant === 'ghost' && styles.ghostBorder,
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  ghostBorder: { borderWidth: 1, borderColor: colors.accent },
  label: { fontFamily: font.display, fontSize: 16 },
});
