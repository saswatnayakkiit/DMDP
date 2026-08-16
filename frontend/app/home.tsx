import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, shadow, inr } from '@/src/theme';
import { SUBS, TOTAL_LAST_MONTH } from '@/src/data';
import { useApp, useTheme } from '@/src/store';
import { BottomNav, Chip, SwipeableSubRow, Card } from '@/src/components';

export default function Home() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { statuses, totalSaved, monthTotal, cancelledItems } = useApp();

  const activeSubs = SUBS.filter(s => statuses[s.id]?.state !== 'cancelled');
  const nextUp = activeSubs.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.hi}>Hi Saswat</Text>
        <Text style={styles.month}>September 2026</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: S.pad, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Card testID="hero-total">
          <Text style={styles.totalCap}>renewing this month</Text>
          <Text style={styles.totalNum}>{inr(monthTotal)}</Text>
          <View style={styles.compareRow}>
            <Ionicons name="arrow-up" size={14} color={C.amber} />
            <Text style={styles.compareTxt}>
              vs <Text style={{ fontWeight: '700', color: C.text }}>{inr(TOTAL_LAST_MONTH)}</Text> last month
            </Text>
          </View>
        </Card>

        <Pressable
          testID="savings-card"
          onPress={() => { Haptics.selectionAsync(); router.push('/savings' as any); }}
          style={({ pressed }) => [styles.savingsCard, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={styles.savingsIcon}>
            <Ionicons name="leaf" size={20} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.savingsCap}>Saved so far</Text>
            <Text style={styles.savingsNum} testID="savings-total">{inr(totalSaved)}</Text>
            <Text style={styles.savingsSub}>from {cancelledItems.length} cancelled subscription{cancelledItems.length === 1 ? '' : 's'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.teal} />
        </Pressable>

        <View style={styles.chipsRow}>
          <Pressable testID="chip-unused" onPress={() => { Haptics.selectionAsync(); router.push('/alerts' as any); }}>
            <Chip label="1 unused" tone="amber" />
          </Pressable>
          <Pressable testID="chip-price" onPress={() => { Haptics.selectionAsync(); router.push('/alerts' as any); }}>
            <Chip label="1 price change" tone="amber" />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Next up</Text>

        <View style={{ gap: S.gap }}>
          {nextUp.map((s) => (
            <SwipeableSubRow
              key={s.id}
              sub={s}
              onPress={() => router.push({ pathname: '/detail', params: { id: s.id } } as any)}
            />
          ))}
        </View>

        <Text style={styles.swipeHint}>Swipe left on a subscription to snooze or mark cancelled</Text>

        <Pressable testID="see-all" onPress={() => { Haptics.selectionAsync(); router.push('/calendar' as any); }} style={{ marginTop: 8, alignSelf: 'flex-start', padding: 4 }}>
          <Text style={{ color: C.teal, fontSize: 14, fontWeight: '600' }}>See all {activeSubs.length} →</Text>
        </Pressable>
      </ScrollView>

      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingHorizontal: S.pad, paddingTop: 4, paddingBottom: 4,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  hi: { color: C.sub, fontSize: 12 },
  month: { color: C.sub, fontSize: 12, fontWeight: '600' },
  totalCap: { color: C.sub, fontSize: 12 },
  totalNum: { color: C.text, fontSize: 32, fontWeight: '800', marginTop: 4 },
  compareRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  compareTxt: { color: C.sub, fontSize: 12 },
  savingsCard: {
    marginTop: 12, backgroundColor: C.tealTint, borderRadius: R.card, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  savingsIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center',
    ...shadow,
  },
  savingsCap: { color: C.teal, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  savingsNum: { color: C.text, fontSize: 20, fontWeight: '800', marginTop: 1 },
  savingsSub: { color: C.sub, fontSize: 11, marginTop: 1 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  swipeHint: { color: C.sub, fontSize: 11, marginTop: 10, fontStyle: 'italic' },
});
