export function formatIDR(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}
