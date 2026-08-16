import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, inr, shortDate, daysUntil, shadow } from '@/src/theme';
import { getSub } from '@/src/data';
import { useApp, useTheme } from '@/src/store';
import { PrimaryBtn, SecondaryBtn, Logo, TopBar, Card, Chip } from '@/src/components';

export default function Detail() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { statuses, paid, togglePaid, cancelSub, restoreSub } = useApp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sub = getSub(id ?? 'netflix') ?? getSub('netflix')!;
  const [sheet, setSheet] = useState(false);

  const state = statuses[sub.id]?.state ?? 'active';
  const d = daysUntil(sub.renewDate);
  const inTxt = d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;

  const markCancelled = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    cancelSub(sub.id);
    setSheet(false);
  };

  // Family split figures
  const members = sub.shared?.members ?? [];
  const owedTotal = members.reduce((a, m) => a + m.share, 0);
  const collected = members.reduce((a, m) => a + (paid[`${sub.id}:${m.id}`] ? m.share : 0), 0);
  const allPaid = members.length > 0 && collected === owedTotal;

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

        {state === 'cancelled' ? (
          <View style={[styles.statusStrip, { backgroundColor: C.redTint }]} testID="status-cancelled">
            <Ionicons name="close-circle-outline" size={16} color={C.red} />
            <Text style={[styles.statusTxt, { color: C.red }]}>
              Cancelled · you're saving {inr(sub.amount)}/mo
            </Text>
          </View>
        ) : state === 'snoozed' ? (
          <View style={[styles.statusStrip, { backgroundColor: C.amberTint }]} testID="status-snoozed">
            <Ionicons name="alarm-outline" size={16} color={C.amber} />
            <Text style={[styles.statusTxt, { color: C.amber }]}>
              Reminders snoozed · Renews {inTxt} · {shortDate(sub.renewDate)}
            </Text>
          </View>
        ) : (
          <View style={styles.statusStrip} testID="status-active">
            <Ionicons name="time-outline" size={16} color={C.teal} />
            <Text style={styles.statusTxt}>
              Renews {inTxt} · {shortDate(sub.renewDate)} · {sub.method}
              {sub.methodDetail ? ` (${sub.methodDetail})` : ''}
            </Text>
          </View>
        )}

        <SectionTitle styles={styles}>Charge history</SectionTitle>
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
            <SectionTitle styles={styles}>Family split · {sub.shared.splitWays} ways</SectionTitle>
            <Card testID="family-split">
              {/* You */}
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: C.teal }]}><Text style={{ color: C.onTeal, fontWeight: '800' }}>Y</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>You</Text>
                  <Text style={styles.memberMeta}>pays the bill</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.memberShare}>{inr(sub.shared.yourShare)}</Text>
                  <Text style={styles.memberMeta}>your share</Text>
                </View>
              </View>

              {members.map(m => {
                const key = `${sub.id}:${m.id}`;
                const isPaid = !!paid[key];
                return (
                  <View key={m.id}>
                    <View style={styles.divider} />
                    <View style={styles.memberRow}>
                      <View style={[styles.avatar, { backgroundColor: isPaid ? C.teal : C.amber }]}>
                        <Text style={{ color: '#fff', fontWeight: '800' }}>{m.name[0]}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.memberName}>{m.name}</Text>
                        <Text style={[styles.memberMeta, !isPaid && { color: C.amber, fontWeight: '600' }]}>
                          {isPaid ? 'paid for September' : `owes you ${inr(m.share)}`}
                        </Text>
                      </View>
                      <Pressable
                        testID={`mark-paid-${m.id}`}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); togglePaid(key); }}
                        style={[styles.paidBtn, isPaid && { backgroundColor: C.teal, borderColor: C.teal }]}
                      >
                        {isPaid && <Ionicons name="checkmark" size={14} color={C.onTeal} />}
                        <Text style={{ color: isPaid ? C.onTeal : C.teal, fontSize: 12, fontWeight: '700' }}>
                          {isPaid ? 'Paid' : 'Mark paid'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}

              <View style={[styles.settleStrip, { backgroundColor: allPaid ? C.tealTint : C.amberTint }]} testID="settle-summary">
                <Ionicons name={allPaid ? 'checkmark-circle' : 'hourglass-outline'} size={15} color={allPaid ? C.teal : C.amber} />
                <Text style={{ color: allPaid ? C.teal : C.amber, fontSize: 12.5, fontWeight: '600', flex: 1 }}>
                  {allPaid
                    ? 'All settled for September'
                    : `September: ${inr(collected)} of ${inr(owedTotal)} collected · ${inr(owedTotal - collected)} pending`}
                </Text>
              </View>
            </Card>
          </>
        )}

        <Pressable style={styles.reminderRow} onPress={() => Haptics.selectionAsync()}>
          <Text style={styles.lbl}>Reminder</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.val}>{state === 'snoozed' ? 'Snoozed' : '3 days before'}</Text>
            <Ionicons name="chevron-down" size={16} color={C.sub} />
          </View>
        </Pressable>

        <View style={{ marginTop: 24, gap: 12 }}>
          {state === 'cancelled' ? (
            <SecondaryBtn testID="restore-sub" label="Restore subscription" onPress={() => restoreSub(sub.id)} />
          ) : (
            <>
              <SecondaryBtn testID="how-to-cancel" label="How to cancel" onPress={() => setSheet(true)} />
              <Pressable onPress={() => Haptics.selectionAsync()} style={{ alignItems: 'center', padding: 8 }}>
                <Text style={{ color: C.teal, fontSize: 14, fontWeight: '600' }}>Pause reminders</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      <Modal transparent visible={sheet} animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheet(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Cancel {sub.short} in 3 steps</Text>
            {[
              `Open ${sub.short} › Account.`,
              'Tap Cancel Membership.',
              'Cancel the UPI mandate in your bank or UPI app so no future debit goes through.',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}><Text style={{ color: C.onTeal, fontWeight: '800' }}>{i + 1}</Text></View>
                <Text style={styles.stepTxt}>{step}</Text>
              </View>
            ))}
            <PrimaryBtn testID="open-service" label={`Open ${sub.short}`} onPress={() => setSheet(false)} style={{ marginTop: 20 }} />
            <Pressable testID="mark-cancelled" onPress={markCancelled} style={{ alignItems: 'center', padding: 12, marginTop: 4 }}>
              <Text style={{ color: C.red, fontSize: 14, fontWeight: '600' }}>Mark as cancelled</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({ children, styles }: { children: React.ReactNode; styles: any }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const makeStyles = (C: Palette) => StyleSheet.create({
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
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  memberName: { color: C.text, fontSize: 15, fontWeight: '700' },
  memberMeta: { color: C.sub, fontSize: 12, marginTop: 2 },
  memberShare: { color: C.text, fontSize: 15, fontWeight: '800' },
  paidBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: C.teal, borderRadius: R.chip,
    paddingHorizontal: 12, paddingVertical: 7, minHeight: 32,
  },
  settleStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, padding: 10, marginTop: 10,
  },
  reminderRow: {
    backgroundColor: C.card, borderRadius: R.card, padding: 14, marginTop: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: C.cardBorder,
    ...shadow, shadowOpacity: 0.04,
  },
  lbl: { color: C.sub, fontSize: 13 },
  val: { color: C.text, fontSize: 14, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: C.backdrop, justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: S.pad, paddingBottom: 32 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { flex: 1, color: C.text, fontSize: 14, lineHeight: 20 },
});
