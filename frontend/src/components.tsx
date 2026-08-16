import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C, R, S, shadow, inr, daysUntil } from './theme';
import { Sub } from './data';

/* ---------- Service logo tile ---------- */
export function Logo({ letter, color, size = 44, dashed }: { letter: string; color: string; size?: number; dashed?: boolean }) {
  const isCustom = dashed;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size >= 56 ? 14 : 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isCustom ? 'transparent' : color,
          borderWidth: isCustom ? 1.5 : 0,
          borderColor: C.sub,
          borderStyle: isCustom ? 'dashed' : 'solid',
        },
      ]}
    >
      <Text
        style={{
          color: isCustom ? C.sub : '#fff',
          fontWeight: '800',
          fontSize: Math.round(size * 0.42),
        }}
      >
        {letter}
      </Text>
    </View>
  );
}

/* ---------- Chip ---------- */
export function Chip({ label, tone = 'teal', testID }: { label: string; tone?: 'teal' | 'amber'; testID?: string }) {
  const color = tone === 'amber' ? C.amber : C.teal;
  return (
    <View testID={testID} style={[styles.chip, { borderColor: color }]}>
      <Text style={{ color, fontSize: 13, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

/* ---------- Buttons ---------- */
export function PrimaryBtn({ label, onPress, testID, style }: { label: string; onPress?: () => void; testID?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      testID={testID}
      onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
      style={({ pressed }) => [styles.btn, { backgroundColor: C.teal, opacity: pressed ? 0.85 : 1 }, style]}
    >
      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryBtn({ label, onPress, testID, style, tone = 'teal' }: { label: string; onPress?: () => void; testID?: string; style?: StyleProp<ViewStyle>; tone?: 'teal' | 'red' }) {
  const c = tone === 'red' ? C.red : C.teal;
  return (
    <Pressable
      testID={testID}
      onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
      style={({ pressed }) => [styles.btn, { borderColor: c, borderWidth: 1.5, backgroundColor: 'transparent', opacity: pressed ? 0.7 : 1 }, style]}
    >
      <Text style={{ color: c, fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Subscription row ---------- */
export function SubRow({ sub, onPress, subtitleOverride, testID }: { sub: Sub; onPress?: () => void; subtitleOverride?: string; testID?: string }) {
  const d = daysUntil(sub.renewDate);
  const inTxt = d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
  const subtitle = subtitleOverride ?? `${inTxt} · ${sub.method}`;
  return (
    <Pressable
      testID={testID ?? `sub-row-${sub.id}`}
      onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
      style={({ pressed }) => [styles.subRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Logo letter={sub.logo} color={sub.color} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.subName} numberOfLines={1}>{sub.name}</Text>
        <Text style={styles.subMeta} numberOfLines={1}>{subtitle}</Text>
      </View>
      <Text style={styles.subAmt}>{inr(sub.amount)}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.sub} style={{ marginLeft: 4 }} />
    </Pressable>
  );
}

/* ---------- Bottom nav ---------- */
type NavKey = 'home' | 'calendar' | 'add' | 'alerts' | 'settings';

export function BottomNav({ active }: { active: NavKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const go = (key: NavKey, route: string) => {
    Haptics.selectionAsync();
    if (pathname !== route) router.push(route as any);
  };
  const item = (key: NavKey, icon: keyof typeof Ionicons.glyphMap, label: string, route: string) => {
    const isActive = active === key;
    return (
      <Pressable key={key} testID={`nav-${key}`} onPress={() => go(key, route)} style={styles.navItem} hitSlop={8}>
        <Ionicons name={icon} size={22} color={isActive ? C.teal : C.sub} />
        <Text style={{ color: isActive ? C.teal : C.sub, fontSize: 11, marginTop: 2, fontWeight: isActive ? '700' : '500' }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.nav} testID="bottom-nav">
      {item('home', 'home', 'Home', '/home')}
      {item('calendar', 'calendar', 'Calendar', '/calendar')}
      <Pressable testID="nav-add" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/add' as any); }} style={styles.addBtn} hitSlop={8}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
      {item('alerts', 'notifications', 'Alerts', '/alerts')}
      {item('settings', 'settings-outline', 'Settings', '/settings')}
    </View>
  );
}

/* ---------- Screen header (title + optional back) ---------- */
export function TopBar({ title, right, onBack, testID }: { title?: string; right?: React.ReactNode; onBack?: () => void; testID?: string }) {
  return (
    <View style={styles.topbar} testID={testID}>
      {onBack ? (
        <Pressable testID="top-back" onPress={() => { Haptics.selectionAsync(); onBack(); }} hitSlop={12} style={{ padding: 4, marginLeft: -4 }}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </Pressable>
      ) : <View style={{ width: 26 }} />}
      <Text style={styles.topTitle} numberOfLines={1}>{title ?? ''}</Text>
      <View style={{ minWidth: 26, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/* ---------- Card wrapper ---------- */
export function Card({ children, style, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return <View testID={testID} style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    height: 28,
    borderRadius: R.chip,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btn: {
    height: 48,
    borderRadius: R.card,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  subRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.card,
    borderRadius: R.card,
    ...shadow,
  },
  subName: { color: C.text, fontSize: 15, fontWeight: '700' },
  subMeta: { color: C.sub, fontSize: 12, marginTop: 2 },
  subAmt: { color: C.text, fontSize: 15, fontWeight: '800' },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    paddingBottom: 8,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  addBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.teal,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, marginTop: -18,
    ...shadow,
    shadowOpacity: 0.18,
  },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: S.pad, height: 52, backgroundColor: C.bg,
  },
  topTitle: { flex: 1, textAlign: 'left', marginLeft: 4, color: C.text, fontSize: 20, fontWeight: '700' },
  card: {
    backgroundColor: C.card,
    borderRadius: R.card,
    padding: S.pad,
    ...shadow,
  },
});
