/**
 * Font family keys must match `useFonts({ ... })` in NutriaApp.tsx.
 * Mirrors the HTML export: Georgia/Lora italic for display, system feel for UI body.
 */
export const font = {
  displayItalic: 'Lora_600SemiBold_Italic',
  display: 'Lora_600SemiBold',
  body: 'Lora_400Regular',
  bodyItalic: 'Lora_400Regular_Italic',
} as const;
