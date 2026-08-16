export type Sub = {
  id: string;
  name: string;
  short: string;
  amount: number;
  cycle: 'Monthly' | 'Yearly';
  renewDate: string; // ISO
  method: 'UPI Autopay' | 'Card' | 'Play Store' | 'Net banking';
  methodDetail?: string;
  shared?: { with: string; splitWays: number; yourShare: number };
  priceChange?: { from: number; to: number; when: string };
  unusedDays?: number;
  logo: string;
  color: string;
};

export const SUBS: Sub[] = [
  { id: 'netflix', name: 'Netflix Premium', short: 'Netflix', amount: 649, cycle: 'Monthly', renewDate: '2026-09-19', method: 'UPI Autopay', methodDetail: 'HDFC \u2022\u20224421', shared: { with: 'Sristhi', splitWays: 2, yourShare: 324 }, priceChange: { from: 499, to: 649, when: 'June' }, logo: 'N', color: '#E50914' },
  { id: 'spotify', name: 'Spotify', short: 'Spotify', amount: 119, cycle: 'Monthly', renewDate: '2026-09-21', method: 'Card', logo: 'S', color: '#1DB954' },
  { id: 'cultfit', name: 'Cult.fit', short: 'Cult.fit', amount: 1499, cycle: 'Monthly', renewDate: '2026-09-28', method: 'UPI Autopay', priceChange: { from: 1299, to: 1499, when: 'last month' }, logo: 'C', color: '#DC2626' },
  { id: 'hotstar', name: 'Hotstar', short: 'Hotstar', amount: 299, cycle: 'Monthly', renewDate: '2026-10-03', method: 'UPI Autopay', unusedDays: 34, logo: 'H', color: '#1E293B' },
  { id: 'ytpremium', name: 'YouTube Premium', short: 'YouTube', amount: 149, cycle: 'Monthly', renewDate: '2026-10-05', method: 'Play Store', logo: 'Y', color: '#FF0000' },
  { id: 'icloud', name: 'iCloud+', short: 'iCloud', amount: 75, cycle: 'Monthly', renewDate: '2026-10-12', method: 'Card', logo: 'i', color: '#94A3B8' },
  { id: 'jio', name: 'Jio Postpaid', short: 'Jio', amount: 399, cycle: 'Monthly', renewDate: '2026-10-15', method: 'UPI Autopay', logo: 'J', color: '#7C2D12' },
  { id: 'chatgpt', name: 'ChatGPT Plus', short: 'ChatGPT', amount: 1999, cycle: 'Monthly', renewDate: '2026-10-22', method: 'Card', logo: 'G', color: '#10A37F' },
];

export const ADD_GRID = [
  { id: 'netflix', name: 'Netflix', logo: 'N', color: '#E50914' },
  { id: 'prime', name: 'Amazon Prime', logo: 'P', color: '#1E293B' },
  { id: 'hotstar', name: 'Hotstar', logo: 'H', color: '#1E293B' },
  { id: 'spotify', name: 'Spotify', logo: 'S', color: '#1DB954' },
  { id: 'ytpremium', name: 'YouTube Premium', logo: 'Y', color: '#FF0000' },
  { id: 'jio', name: 'Jio', logo: 'J', color: '#7C2D12' },
  { id: 'airtel', name: 'Airtel', logo: 'A', color: '#DC2626' },
  { id: 'cultfit', name: 'Cult.fit', logo: 'C', color: '#DC2626' },
  { id: 'icloud', name: 'iCloud', logo: 'i', color: '#94A3B8' },
  { id: 'chatgpt', name: 'ChatGPT', logo: 'G', color: '#10A37F' },
  { id: 'custom', name: 'Custom', logo: '+', color: 'transparent' },
];

export const TOTAL_THIS_MONTH = 3847;
export const TOTAL_LAST_MONTH = 3228;

export const getSub = (id: string) => SUBS.find(s => s.id === id);
