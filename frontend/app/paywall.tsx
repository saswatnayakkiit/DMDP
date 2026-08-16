import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, shadow } from '@/src/theme';
import { useTheme } from '@/src/store';
import { PrimaryBtn, TopBar, BrandMark } from '@/src/components';

const BENEFITS = [
  'Unlimited subscriptions (free plan: 5)',
  'Auto-detect from SMS',
  'Family sharing and split tracking',
  'Price-hike alerts',
];

export default function Paywall() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [plan, setPlan] = useState<'m' | 'y'>('y');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TopBar onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <BrandMark size={56} />
          </View>
        </View>

        <Text style={styles.title}>Renewly Plus</Text>
        <Text style={styles.subtitle}>Never miss a renewal again.</Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.check}><Ionicons name="checkmark" size={14} color={C.onTeal} /></View>
              <Text style={styles.benefitTxt}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.segment}>
          <Pressable
            testID="plan-monthly"
            onPress={() => { Haptics.selectionAsync(); setPlan('m'); }}
            style={[styles.segItem, plan === 'm' && styles.segItemActive]}
          >
            <Text style={[styles.segTxt, plan === 'm' && styles.segTxtActive]}>₹99 / month</Text>
          </Pressable>
          <Pressable
            testID="plan-yearly"
            onPress={() => { Haptics.selectionAsync(); setPlan('y'); }}
            style={[styles.segItem, plan === 'y' && styles.segItemActive]}
          >
            <Text style={[styles.segTxt, plan === 'y' && styles.segTxtActive]}>₹599 / year</Text>
            <Text style={[styles.segCap, plan === 'y' && { color: C.onTeal }]}>save 50% · ≈ ₹50/mo</Text>
          </Pressable>
        </View>

        <PrimaryBtn testID="start-trial" label="Start 7-day free trial" onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.back(); }} style={{ marginTop: 20 }} />

        <Text style={styles.footer}>
          Cancel anytime. Yes, we'll remind you before that renews too.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  heroWrap: { alignItems: 'center', marginTop: 8 },
  heroCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: C.tealTint,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: C.text, fontSize: 26, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  subtitle: { color: C.sub, fontSize: 15, textAlign: 'center', marginTop: 6 },
  benefits: { marginTop: 24, gap: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  benefitTxt: { color: C.text, fontSize: 15, flex: 1 },
  segment: {
    flexDirection: 'row', marginTop: 28, borderRadius: R.card, backgroundColor: C.card,
    padding: 4, gap: 4,
    borderWidth: 1, borderColor: C.cardBorder,
    ...shadow, shadowOpacity: 0.05,
  },
  segItem: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  segItemActive: { backgroundColor: C.teal },
  segTxt: { color: C.text, fontSize: 14, fontWeight: '700' },
  segTxtActive: { color: C.onTeal },
  segCap: { color: C.sub, fontSize: 11, marginTop: 2 },
  footer: { color: C.sub, fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
