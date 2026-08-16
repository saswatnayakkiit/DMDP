import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C, S, R } from '@/src/theme';
import { BottomNav, TopBar } from '@/src/components';

export default function Settings() {
  const router = useRouter();
  const [sms, setSms] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Settings" />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          <Row testID="row-reminders" title="Reminders" value="3 days before" chevron />
          <Divider />
          <Row testID="row-quiet" title="Quiet hours" value="10 pm – 8 am" chevron />
          <Divider />
          <Row
            testID="row-sms"
            title="SMS auto-detect"
            right={<Switch value={sms} onValueChange={(v) => { Haptics.selectionAsync(); setSms(v); }} trackColor={{ false: C.border, true: C.teal }} thumbColor="#fff" />}
          />
          <Divider />
          <Row testID="row-currency" title="Currency" value="INR" chevron />
          <Divider />
          <Row testID="row-export" title="Export to CSV" chevron />
        </View>

        <Pressable
          testID="renewly-plus"
          onPress={() => { Haptics.selectionAsync(); router.push('/paywall' as any); }}
          style={styles.plusRow}
        >
          <View style={styles.plusIcon}><Ionicons name="star" size={18} color="#fff" /></View>
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

function Row({ title, value, chevron, right, onPress, testID }: { title: string; value?: string; chevron?: boolean; right?: React.ReactNode; onPress?: () => void; testID?: string }) {
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

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  group: {
    backgroundColor: C.card, borderRadius: R.card, overflow: 'hidden',
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
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
