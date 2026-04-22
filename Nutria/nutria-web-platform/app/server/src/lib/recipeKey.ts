/** Stable key for recipe title / ingredient dedupe (Unicode-normalized, lowercased). */
export function normalizeRecipeNameKey(title: string): string {
  return title
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function normalizeIngredientKey(name: string): string {
  return normalizeRecipeNameKey(name);
}
