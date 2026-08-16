import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, inr, shortDate } from '@/src/theme';
import { useApp, useTheme, monthsSaved } from '@/src/store';
import { TopBar, Logo, Card } from '@/src/components';

export default function Savings() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { cancelledItems, totalSaved, restoreSub } = useApp();

  const monthlyFreed = cancelledItems.reduce((a, it) => a + it.amount, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Savings" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero} testID="savings-hero">
          <View style={styles.heroIcon}>
            <Ionicons name="leaf" size={26} color={C.teal} />
          </View>
          <Text style={styles.heroCap}>Saved so far</Text>
          <Text style={styles.heroNum} testID="savings-hero-total">{inr(totalSaved)}</Text>
          {monthlyFreed > 0 && (
            <Text style={styles.heroSub}>
              That's <Text style={{ fontWeight: '800', color: C.teal }}>{inr(monthlyFreed * 12)}</Text> a year back in your pocket
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Cancelled subscriptions</Text>

        {cancelledItems.length === 0 ? (
          <Card testID="savings-empty">
            <Text style={styles.emptyTitle}>Nothing cancelled yet</Text>
            <Text style={styles.emptySub}>Swipe left on any subscription and tap "Cancelled" to start saving.</Text>
          </Card>
        ) : (
          <View style={{ gap: S.gap }}>
            {cancelledItems.map(it => {
              const m = monthsSaved(it.cancelledOn);
              return (
                <Card key={it.id} testID={`saved-${it.id}`} style={{ padding: 12 }}>
                  <View style={styles.row}>
                    <Logo letter={it.logo} color={it.color} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.name}>{it.name}</Text>
                      <Text style={styles.meta}>Cancelled {shortDate(it.cancelledOn)} · {inr(it.amount)}/mo</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.saved} testID={`saved-amt-${it.id}`}>+{inr(it.amount * m)}</Text>
                      <Text style={styles.meta}>{m} month{m === 1 ? '' : 's'} saved</Text>
                    </View>
                  </View>
                  {it.restorable && (
                    <Pressable
                      testID={`restore-${it.id}`}
                      onPress={() => { Haptics.selectionAsync(); restoreSub(it.id); }}
                      style={styles.restoreBtn}
                    >
                      <Ionicons name="refresh" size={14} color={C.teal} />
                      <Text style={{ color: C.teal, fontSize: 13, fontWeight: '700' }}>Restore subscription</Text>
                    </Pressable>
                  )}
                </Card>
              );
            })}
          </View>
        )}

        <View style={styles.tip}>
          <Ionicons name="sparkles" size={16} color={C.teal} />
          <Text style={styles.tipTxt}>Every cancelled subscription keeps counting each month it stays cancelled.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  hero: { backgroundColor: C.tealTint, borderRadius: R.tile, padding: 24, alignItems: 'center' },
  heroIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  heroCap: { color: C.teal, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  heroNum: { color: C.text, fontSize: 40, fontWeight: '800', marginTop: 4 },
  heroSub: { color: C.sub, fontSize: 13, marginTop: 8, textAlign: 'center' },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { color: C.text, fontSize: 15, fontWeight: '700' },
  meta: { color: C.sub, fontSize: 12, marginTop: 2 },
  saved: { color: C.teal, fontSize: 15, fontWeight: '800' },
  restoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 12, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: C.teal,
  },
  emptyTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  emptySub: { color: C.sub, fontSize: 13, marginTop: 6, lineHeight: 19 },
  tip: {
    marginTop: 20, backgroundColor: C.tealTint, borderRadius: R.card, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  tipTxt: { color: C.teal, fontSize: 13, flex: 1, lineHeight: 18 },
});
