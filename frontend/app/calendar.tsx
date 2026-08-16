import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Palette, S, R, inr, shortDate } from '@/src/theme';
import { SUBS, TOTAL_LAST_MONTH } from '@/src/data';
import { useApp, useTheme } from '@/src/store';
import { BottomNav, SubRow, SwipeableSubRow } from '@/src/components';

const TODAY = { y: 2026, m: 8, d: 16 }; // month is 0-indexed: 8 = Sep

// Build 5x7 grid for Sep 2026 (Sep 1 2026 = Tuesday -> col idx 1 if Mon-first)
function buildGrid() {
  const first = new Date(2026, 8, 1);
  // Mon=0 ... Sun=6
  const jsDay = first.getDay(); // Sun=0..Sat=6
  const mondayIdx = (jsDay + 6) % 7;
  const daysInMonth = new Date(2026, 9, 0).getDate(); // Sep has 30
  const cells: { day: number | null; inMonth: boolean; d?: Date }[] = [];
  for (let i = 0; i < mondayIdx; i++) cells.push({ day: null, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true, d: new Date(2026, 8, d) });
  // pad to 35 (5 rows) or 42
  while (cells.length < 35) cells.push({ day: null, inMonth: false });
  return cells;
}

export default function CalendarScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { statuses, monthTotal } = useApp();
  const [sheetDay, setSheetDay] = useState<number | null>(null);
  const cells = useMemo(buildGrid, []);

  const activeSubs = SUBS.filter(s => statuses[s.id]?.state !== 'cancelled');
  const renewDaysSep = activeSubs
    .filter(s => new Date(s.renewDate).getMonth() === 8)
    .map(s => new Date(s.renewDate).getDate());

  const openDay = (day: number) => {
    if (!renewDaysSep.includes(day)) return;
    Haptics.selectionAsync();
    setSheetDay(day);
  };

  const subsForDay = (day: number) => activeSubs.filter(s => {
    const d = new Date(s.renewDate);
    return d.getMonth() === 8 && d.getDate() === day;
  });

  const daySubs = sheetDay ? subsForDay(sheetDay) : [];
  const dayTotal = daySubs.reduce((a, b) => a + b.amount, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => Haptics.selectionAsync()}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>September 2026</Text>
        <Pressable hitSlop={8} onPress={() => Haptics.selectionAsync()}>
          <Ionicons name="chevron-forward" size={22} color={C.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.weekRow}>
          {['M','T','W','T','F','S','S'].map((w, i) => (
            <Text key={i} style={styles.weekTxt}>{w}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((c, idx) => {
            const isToday = c.day === TODAY.d;
            const hasRenew = c.day != null && renewDaysSep.includes(c.day);
            const isPast = c.day != null && c.day < TODAY.d;
            return (
              <Pressable
                key={idx}
                testID={c.day ? `cal-day-${c.day}` : undefined}
                onPress={() => c.day && openDay(c.day)}
                style={[
                  styles.cell,
                  isToday && { borderWidth: 1.5, borderColor: C.teal, borderRadius: 10 },
                ]}
              >
                {c.day != null && (
                  <>
                    <Text style={[
                      styles.cellTxt,
                      isPast && { color: C.border },
                    ]}>{c.day}</Text>
                    {hasRenew && <View style={styles.dot} />}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTxt}>
            Total this month <Text style={styles.bold}>{inr(monthTotal)}</Text>
            <Text style={{ color: C.sub }}> · Last month </Text>
            <Text style={styles.bold}>{inr(TOTAL_LAST_MONTH)}</Text>
          </Text>
        </View>

        <Text style={styles.upcoming}>Upcoming renewals</Text>
        <View style={{ gap: S.gap }}>
          {activeSubs.slice(0, 5).map(s => (
            <SwipeableSubRow key={s.id} sub={s} onPress={() => router.push({ pathname: '/detail', params: { id: s.id } } as any)} />
          ))}
        </View>
      </ScrollView>

      <BottomNav active="calendar" />

      <Modal transparent visible={sheetDay != null} animationType="slide" onRequestClose={() => setSheetDay(null)}>
        <Pressable style={styles.backdrop} onPress={() => setSheetDay(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>
              {sheetDay ? `${sheetDay} Sep` : ''} · <Text style={styles.bold}>{inr(dayTotal)}</Text>
            </Text>
            <View style={{ gap: S.gap, marginTop: 12 }}>
              {daySubs.map(s => (
                <SubRow key={s.id} sub={s} subtitleOverride={`${shortDate(s.renewDate)} · ${s.method}`} onPress={() => { setSheetDay(null); router.push({ pathname: '/detail', params: { id: s.id } } as any); }} />
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.pad, height: 52 },
  headerTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  weekTxt: { flex: 1, textAlign: 'center', color: C.sub, fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cellTxt: { color: C.text, fontSize: 14, fontWeight: '600' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.teal, marginTop: 3 },
  summary: { marginTop: 12, padding: 12, borderRadius: R.card, backgroundColor: C.divider },
  summaryTxt: { color: C.text, fontSize: 13 },
  bold: { fontWeight: '800', color: C.text },
  upcoming: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  backdrop: { flex: 1, backgroundColor: C.backdrop, justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: S.pad, paddingBottom: 32 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
});
