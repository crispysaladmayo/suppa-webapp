import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/config';
import { font } from '../theme/fonts';

type Props = {
  size?: number;
  /** Outer guide ring + stroke weight like the SVG in Design/Nutria-share (1).html */
  showDesignRing?: boolean;
};

/** Squared “N” tile — 160×160, rx 32 in export; optional inner ring (r=44 stroke) as in the HTML. */
export function NutriaLogo({ size = 40, showDesignRing = false }: Props) {
  const corner = size * 0.2;
  const fontSize = Math.round(size * 0.44);
  const ringDiameter = size * (88 / 160);
  const ringBorder = Math.max(2, (6 * size) / 160);

  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: corner }]}>
      {showDesignRing ? (
        <View
          pointerEvents="none"
          style={[
            styles.svgRing,
            {
              width: ringDiameter,
              height: ringDiameter,
              borderRadius: ringDiameter / 2,
              borderWidth: ringBorder,
              top: (size - ringDiameter) / 2,
              left: (size - ringDiameter) / 2,
            },
          ]}
        />
      ) : null}
      <Text style={[styles.n, { fontSize }]}>N</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  svgRing: {
    position: 'absolute',
    borderColor: 'rgba(255, 254, 249, 0.35)',
    backgroundColor: 'transparent',
  },
  n: {
    fontFamily: font.displayItalic,
    color: colors.surface,
    includeFontPadding: false,
  },
});
