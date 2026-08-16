import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C, S, R, inr, shortDate, daysUntil } from '@/src/theme';
import { getSub } from '@/src/data';
import { PrimaryBtn, SecondaryBtn, Logo, TopBar, Card, Chip } from '@/src/components';

export default function Detail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sub = getSub(id ?? 'netflix') ?? getSub('netflix')!;
  const [sheet, setSheet] = useState(false);

  const d = daysUntil(sub.renewDate);
  const inTxt = d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Logo letter={sub.logo} color={sub.color} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{sub.name}</Text>
            <Text style={styles.price}>{inr(sub.amount)} <Text style={{ fontWeight: '500', color: C.sub }}>/ {sub.cycle.toLowerCase()}</Text></Text>
          </View>
        </View>

        <View style={styles.statusStrip}>
          <Ionicons name="time-outline" size={16} color={C.teal} />
          <Text style={styles.statusTxt}>
            Renews {inTxt} · {shortDate(sub.renewDate)} · {sub.method}
            {sub.methodDetail ? ` (${sub.methodDetail})` : ''}
          </Text>
        </View>

        <SectionTitle>Charge history</SectionTitle>
        <Card>
          {[
            { m: 'Aug', a: 649 },
            { m: 'Jul', a: 649 },
            { m: 'Jun', a: 499, tag: true },
          ].map((h, i, arr) => (
            <View key={h.m}>
              <View style={styles.chargeRow}>
                <Text style={styles.chargeMonth}>{h.m}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  {h.tag && <Chip label="price increased ₹150" tone="amber" />}
                  <Text style={styles.chargeAmt}>{inr(h.a)}</Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        {sub.shared && (
          <>
            <SectionTitle>Shared with</SectionTitle>
            <Card>
              <View style={styles.sharedRow}>
                <View style={styles.avatar}><Text style={{ color: '#fff', fontWeight: '800' }}>{sub.shared.with[0]}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sharedName}>{sub.shared.with}</Text>
                  <Text style={styles.sharedSplit}>Split {sub.shared.splitWays} ways</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sharedYourShare}>{inr(sub.shared.yourShare)}</Text>
                  <Text style={styles.sharedSplit}>your share</Text>
                </View>
              </View>
            </Card>
          </>
        )}

        <Pressable style={styles.reminderRow} onPress={() => Haptics.selectionAsync()}>
          <Text style={styles.lbl}>Reminder</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.val}>3 days before</Text>
            <Ionicons name="chevron-down" size={16} color={C.sub} />
          </View>
        </Pressable>

        <View style={{ marginTop: 24, gap: 12 }}>
          <SecondaryBtn testID="how-to-cancel" label="How to cancel" onPress={() => setSheet(true)} />
          <Pressable onPress={() => Haptics.selectionAsync()} style={{ alignItems: 'center', padding: 8 }}>
            <Text style={{ color: C.teal, fontSize: 14, fontWeight: '600' }}>Pause reminders</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal transparent visible={sheet} animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheet(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Cancel Netflix in 3 steps</Text>
            {[
              'Open Netflix › Account.',
              'Tap Cancel Membership.',
              'Cancel the UPI mandate in your bank or UPI app so no future debit goes through.',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}><Text style={{ color: '#fff', fontWeight: '800' }}>{i + 1}</Text></View>
                <Text style={styles.stepTxt}>{step}</Text>
              </View>
            ))}
            <PrimaryBtn testID="open-netflix" label="Open Netflix" onPress={() => setSheet(false)} style={{ marginTop: 20 }} />
            <Pressable testID="mark-cancelled" onPress={() => { Haptics.selectionAsync(); setSheet(false); }} style={{ alignItems: 'center', padding: 12, marginTop: 4 }}>
              <Text style={{ color: C.red, fontSize: 14, fontWeight: '600' }}>Mark as cancelled</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { color: C.text, fontSize: 22, fontWeight: '800' },
  price: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 2 },
  statusStrip: {
    backgroundColor: C.tealTint,
    borderRadius: R.card, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
  },
  statusTxt: { color: C.teal, fontSize: 13, fontWeight: '600', flex: 1 },
  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  chargeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  chargeMonth: { color: C.text, fontSize: 15, fontWeight: '700' },
  chargeAmt: { color: C.text, fontSize: 15, fontWeight: '800' },
  divider: { height: 1, backgroundColor: C.divider },
  sharedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  sharedName: { color: C.text, fontSize: 15, fontWeight: '700' },
  sharedSplit: { color: C.sub, fontSize: 12, marginTop: 2 },
  sharedYourShare: { color: C.text, fontSize: 15, fontWeight: '800' },
  reminderRow: {
    backgroundColor: C.card, borderRadius: R.card, padding: 14, marginTop: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  lbl: { color: C.sub, fontSize: 13 },
  val: { color: C.text, fontSize: 14, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: S.pad, paddingBottom: 32 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { flex: 1, color: C.text, fontSize: 14, lineHeight: 20 },
});
