const WD = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
const WD_SHORT = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const MO_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MEI',
  'JUN',
  'JUL',
  'AGU',
  'SEP',
  'OKT',
  'NOV',
  'DES',
];

/** e.g. KAMIS · 23 APRIL */
export function headerDayMonth(d: Date = new Date()): string {
  const w = WD[d.getDay()];
  const day = d.getDate();
  const mo = MO_SHORT[d.getMonth()];
  return `${w} · ${day} ${mo}`;
}

/** Week range from Sunday YYYY-MM-DD: "20 – 26 APRIL" */
export function weekRangeLabel(weekStartYmd: string): string {
  const [y, m, da] = weekStartYmd.split('-').map(Number);
  const start = new Date(y, m - 1, da);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const sm = MO_SHORT[start.getMonth()];
  const em = MO_SHORT[end.getMonth()];
  if (sm === em) return `${start.getDate()} – ${end.getDate()} ${em}`;
  return `${start.getDate()} ${sm} – ${end.getDate()} ${em}`;
}

export function dayFullName(dayIndex: number): string {
  const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return names[dayIndex] ?? names[0];
}

export function weekStripLabel(offset: number, weekStartYmd: string): string {
  const [y, m, da] = weekStartYmd.split('-').map(Number);
  const start = new Date(y, m - 1, da);
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return `${WD_SHORT[d.getDay()]} ${d.getDate()}`;
}
