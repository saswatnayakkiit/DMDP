export const C = {
  teal: '#0F766E',
  tealTint: '#E6F4F2',
  amber: '#F59E0B',
  amberTint: '#FEF3C7',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  sub: '#64748B',
  red: '#DC2626',
  border: '#E2E8F0',
  divider: '#EEF2F6',
};

export const R = { card: 12, chip: 999, tile: 16 };
export const S = { pad: 16, gap: 12, gapSm: 8, gapLg: 16 };

export const shadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export const inr = (n: number) => {
  // Indian formatting: 1,24,000
  const s = Math.round(n).toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const restFmt = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return '\u20B9' + (rest ? restFmt + ',' + last3 : last3);
};

export const shortDate = (iso: string) => {
  const d = new Date(iso);
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return `${d.getDate()} ${m}`;
};

export const daysUntil = (iso: string) => {
  const today = new Date('2026-09-16'); // fixed "today" for prototype
  const d = new Date(iso);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  return diff;
};
