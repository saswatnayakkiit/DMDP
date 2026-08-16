import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT, DARK, Palette } from './theme';
import { SUBS, CANCELLED_SEED, TOTAL_THIS_MONTH } from './data';

export type ThemeMode = 'light' | 'dark' | 'system';
type SubState = 'active' | 'snoozed' | 'cancelled';
export type Statuses = Record<string, { state: SubState; cancelledOn?: string }>;
export type CancelledItem = { id: string; name: string; amount: number; cancelledOn: string; logo: string; color: string; restorable: boolean };

const TODAY = new Date('2026-09-16'); // fixed "today" for prototype

// Number of renewals avoided since cancellation (at least 1).
export const monthsSaved = (cancelledOn: string) => {
  const c = new Date(cancelledOn);
  let m = (TODAY.getFullYear() - c.getFullYear()) * 12 + (TODAY.getMonth() - c.getMonth());
  if (TODAY.getDate() < c.getDate()) m -= 1;
  return Math.max(1, m);
};

type AppCtx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  C: Palette;
  isDark: boolean;
  statuses: Statuses;
  snoozeToggle: (id: string) => void;
  cancelSub: (id: string) => void;
  restoreSub: (id: string) => void;
  paid: Record<string, boolean>;
  togglePaid: (key: string) => void;
  cancelledItems: CancelledItem[];
  totalSaved: number;
  monthTotal: number;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const sys = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [statuses, setStatuses] = useState<Statuses>({});
  const [paid, setPaid] = useState<Record<string, boolean>>({ 'netflix:sristhi': true, 'netflix:rahul': false });

  useEffect(() => {
    AsyncStorage.getItem('renewly:mode').then(v => {
      if (v === 'light' || v === 'dark' || v === 'system') setModeState(v);
    });
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem('renewly:mode', m);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && sys === 'dark');
  const C = isDark ? DARK : LIGHT;

  const snoozeToggle = useCallback((id: string) => {
    setStatuses(p => ({ ...p, [id]: { state: p[id]?.state === 'snoozed' ? 'active' : 'snoozed' } }));
  }, []);
  const cancelSub = useCallback((id: string) => {
    setStatuses(p => ({ ...p, [id]: { state: 'cancelled', cancelledOn: '2026-09-16' } }));
  }, []);
  const restoreSub = useCallback((id: string) => {
    setStatuses(p => ({ ...p, [id]: { state: 'active' } }));
  }, []);
  const togglePaid = useCallback((key: string) => {
    setPaid(p => ({ ...p, [key]: !p[key] }));
  }, []);

  const cancelledItems = useMemo<CancelledItem[]>(() => [
    ...SUBS.filter(s => statuses[s.id]?.state === 'cancelled').map(s => ({
      id: s.id, name: s.name, amount: s.amount,
      cancelledOn: statuses[s.id]?.cancelledOn ?? '2026-09-16',
      logo: s.logo, color: s.color, restorable: true,
    })),
    ...CANCELLED_SEED.map(s => ({ ...s, restorable: false })),
  ], [statuses]);

  const totalSaved = useMemo(
    () => cancelledItems.reduce((a, it) => a + it.amount * monthsSaved(it.cancelledOn), 0),
    [cancelledItems]
  );

  const monthTotal = useMemo(
    () => TOTAL_THIS_MONTH - SUBS
      .filter(s => statuses[s.id]?.state === 'cancelled' && new Date(s.renewDate).getMonth() === 8)
      .reduce((a, b) => a + b.amount, 0),
    [statuses]
  );

  const value = useMemo(() => ({
    mode, setMode, C, isDark,
    statuses, snoozeToggle, cancelSub, restoreSub,
    paid, togglePaid,
    cancelledItems, totalSaved, monthTotal,
  }), [mode, setMode, C, isDark, statuses, snoozeToggle, cancelSub, restoreSub, paid, togglePaid, cancelledItems, totalSaved, monthTotal]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
};

export const useTheme = () => {
  const { C, isDark } = useApp();
  return { C, isDark };
};
