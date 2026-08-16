import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R } from '@/src/theme';
import { useApp, useTheme, ThemeMode } from '@/src/store';
import { BottomNav, TopBar } from '@/src/components';

const MODES: { key: ThemeMode; label: string; icon: 'sunny' | 'moon' | 'phone-portrait-outline' }[] = [
  { key: 'light', label: 'Light', icon: 'sunny' },
  { key: 'dark', label: 'Dark', icon: 'moon' },
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

export default function Settings() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { mode, setMode } = useApp();
  const [sms, setSms] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Settings" />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupLabel}>Appearance</Text>
        <View style={styles.segment} testID="theme-segment">
          {MODES.map(m => {
            const active = mode === m.key;
            return (
              <Pressable
                key={m.key}
                testID={`theme-${m.key}`}
                onPress={() => { Haptics.selectionAsync(); setMode(m.key); }}
                style={[styles.segItem, active && { backgroundColor: C.teal }]}
              >
                <Ionicons name={m.icon} size={16} color={active ? C.onTeal : C.sub} />
                <Text style={[styles.segTxt, active && { color: C.onTeal }]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.groupLabel, { marginTop: 20 }]}>Preferences</Text>
        <View style={styles.group}>
          <Row styles={styles} C={C} testID="row-reminders" title="Reminders" value="3 days before" chevron />
          <Divider styles={styles} />
          <Row styles={styles} C={C} testID="row-quiet" title="Quiet hours" value="10 pm – 8 am" chevron />
          <Divider styles={styles} />
          <Row
            styles={styles} C={C}
            testID="row-sms"
            title="SMS auto-detect"
            right={<Switch value={sms} onValueChange={(v) => { Haptics.selectionAsync(); setSms(v); }} trackColor={{ false: C.border, true: C.teal }} thumbColor="#fff" />}
          />
          <Divider styles={styles} />
          <Row styles={styles} C={C} testID="row-currency" title="Currency" value="INR" chevron />
          <Divider styles={styles} />
          <Row styles={styles} C={C} testID="row-export" title="Export to CSV" chevron />
        </View>

        <Pressable
          testID="renewly-plus"
          onPress={() => { Haptics.selectionAsync(); router.push('/paywall' as any); }}
          style={styles.plusRow}
        >
          <View style={styles.plusIcon}><Ionicons name="star" size={18} color={C.onTeal} /></View>
          <View style={{ flex: 1 }}>
            <View style={styles.plusTitleRow}>
              <Text style={styles.plusTitle}>Renewly Plus</Text>
              <View style={styles.badge}><Text style={styles.badgeTxt}>PRO</Text></View>
            </View>
            <Text style={styles.plusSub}>Unlock unlimited tracking</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.teal} />
        </Pressable>

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ color: C.sub, fontSize: 12 }}>Renewly v1.0 · Know before it renews.</Text>
        </View>
      </ScrollView>

      <BottomNav active="settings" />
    </SafeAreaView>
  );
}

function Row({ title, value, chevron, right, onPress, testID, styles, C }: { title: string; value?: string; chevron?: boolean; right?: React.ReactNode; onPress?: () => void; testID?: string; styles: any; C: Palette }) {
  return (
    <Pressable testID={testID} onPress={() => { Haptics.selectionAsync(); onPress?.(); }} style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {value && <Text style={styles.rowVal}>{value}</Text>}
        {right}
        {chevron && <Ionicons name="chevron-forward" size={18} color={C.sub} />}
      </View>
    </Pressable>
  );
}

function Divider({ styles }: { styles: any }) {
  return <View style={styles.divider} />;
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  groupLabel: { color: C.sub, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  segment: {
    flexDirection: 'row', backgroundColor: C.card, borderRadius: R.card, padding: 4, gap: 4,
    borderWidth: 1, borderColor: C.cardBorder,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  segItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 9,
  },
  segTxt: { color: C.sub, fontSize: 13, fontWeight: '700' },
  group: {
    backgroundColor: C.card, borderRadius: R.card, overflow: 'hidden',
    borderWidth: 1, borderColor: C.cardBorder,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  rowTitle: { color: C.text, fontSize: 15, fontWeight: '600' },
  rowVal: { color: C.sub, fontSize: 14 },
  divider: { height: 1, backgroundColor: C.divider, marginHorizontal: 16 },
  plusRow: {
    marginTop: 20, backgroundColor: C.tealTint, borderRadius: R.card, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  plusIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  plusTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plusTitle: { color: C.text, fontSize: 15, fontWeight: '800' },
  plusSub: { color: C.sub, fontSize: 12, marginTop: 2 },
  badge: { backgroundColor: C.teal, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeTxt: { color: C.onTeal, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
