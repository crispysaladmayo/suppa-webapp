export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function weekStartISO(d = new Date()): string {
  return toISODate(startOfWeekMonday(d));
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function dayLabel(index: number): string {
  return days[index] ?? '?';
}
