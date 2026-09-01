export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

// alias expected by some components
export function getTodayLocalKey(): string {
  return getTodayKey();
}

export function formatDisplayDate(dateKey: string): string {
  const d = new Date(dateKey);
  const dayName = d.toLocaleDateString(undefined, { weekday: 'long' });
  const monthDayYear = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  return `${dayName}, ${monthDayYear}`;
}

export function isSameDateKey(a: string, b: string): boolean {
  return a === b;
}

export function isPastDate(dateKey: string): boolean {
  const today = getTodayKey();
  return dateKey < today;
}