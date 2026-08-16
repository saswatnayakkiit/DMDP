import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C, S, R, shadow, inr } from '@/src/theme';
import { SUBS, TOTAL_THIS_MONTH, TOTAL_LAST_MONTH } from '@/src/data';
import { BottomNav, Chip, SubRow, Card } from '@/src/components';

export default function Home() {
  const router = useRouter();
  const nextUp = SUBS.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.hi}>Hi Saswat</Text>
        <Text style={styles.month}>September 2026</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: S.pad, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Card testID="hero-total">
          <Text style={styles.totalCap}>renewing this month</Text>
          <Text style={styles.totalNum}>{inr(TOTAL_THIS_MONTH)}</Text>
          <View style={styles.compareRow}>
            <Ionicons name="arrow-up" size={14} color={C.amber} />
            <Text style={styles.compareTxt}>
              vs <Text style={{ fontWeight: '700', color: C.text }}>{inr(TOTAL_LAST_MONTH)}</Text> last month
            </Text>
          </View>
        </Card>

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
            <SubRow
              key={s.id}
              sub={s}
              onPress={() => router.push({ pathname: '/detail', params: { id: s.id } } as any)}
            />
          ))}
        </View>

        <Pressable testID="see-all" onPress={() => { Haptics.selectionAsync(); router.push('/calendar' as any); }} style={{ marginTop: 16, alignSelf: 'flex-start', padding: 4 }}>
          <Text style={{ color: C.teal, fontSize: 14, fontWeight: '600' }}>See all 8 →</Text>
        </Pressable>
      </ScrollView>

      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 12 },
});
