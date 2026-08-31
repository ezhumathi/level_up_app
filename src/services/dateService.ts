// Utilities for consistent date keys and display
export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

export function getTodayLocalKey(): string {
  return formatDateKey(new Date());
}

export function getUTCDateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function formatForDisplay(dateKey: string): string {
  // input: YYYY-MM-DD -> output: e.g. Mon, 30 Aug
  try {
    const [y, m, d] = dateKey.split('-').map((s) => parseInt(s, 10));
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  } catch (err) {
    return dateKey;
  }
}

export function isSameDateKey(a: string, b: string): boolean {
  return a === b;
}
