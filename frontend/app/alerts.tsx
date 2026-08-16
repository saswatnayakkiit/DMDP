import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C, S, R, inr } from '@/src/theme';
import { BottomNav, Logo, Card, SecondaryBtn, TopBar } from '@/src/components';

export default function Alerts() {
  const router = useRouter();

  const openDetail = (id: string) => {
    Haptics.selectionAsync();
    router.push({ pathname: '/detail', params: { id } } as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Worth a look" />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card testID="alert-hotstar" style={{ marginBottom: 12 }}>
          <View style={styles.cardHead}>
            <Logo letter="H" color="#1E293B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>You haven't opened Hotstar in 34 days</Text>
              <Text style={styles.cardSub}>{inr(299)}/mo · Still need it?</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <SecondaryBtn label="Keep" onPress={() => Haptics.selectionAsync()} />
            </View>
            <Pressable testID="alert-cancel-hotstar" onPress={() => openDetail('hotstar')} style={styles.textBtn}>
              <Text style={{ color: C.teal, fontSize: 14, fontWeight: '700' }}>How to cancel</Text>
            </Pressable>
          </View>
        </Card>

        <Card testID="alert-netflix" style={{ marginBottom: 12 }}>
          <Pressable onPress={() => openDetail('netflix')}>
            <View style={styles.cardHead}>
              <Logo letter="N" color="#E50914" />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Netflix went up ₹150 since June</Text>
                <Text style={styles.cardSub}>{inr(499)} → <Text style={{ color: C.amber, fontWeight: '700' }}>{inr(649)}</Text></Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.sub} />
            </View>
          </Pressable>
        </Card>

        <Card testID="alert-overlap" style={{ marginBottom: 20 }}>
          <View style={styles.cardHead}>
            <View style={{ flexDirection: 'row' }}>
              <Logo letter="S" color="#1DB954" />
              <View style={{ marginLeft: -14, borderWidth: 2, borderColor: C.card, borderRadius: 12 }}>
                <Logo letter="Y" color="#FF0000" />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.cardTitle}>You pay for Spotify and YouTube Premium</Text>
              <Text style={styles.cardSub}>Both include music</Text>
            </View>
          </View>
        </Card>

        <View style={styles.insight} testID="insight-strip">
          <Ionicons name="sparkles" size={16} color={C.teal} />
          <Text style={styles.insightTxt}>
            Cancelling the unused one saves <Text style={{ fontWeight: '800' }}>{inr(3588)} a year</Text>.
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="alerts" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  cardSub: { color: C.sub, fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  textBtn: { paddingHorizontal: 8, paddingVertical: 12 },
  insight: {
    backgroundColor: C.tealTint, borderRadius: R.card, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  insightTxt: { color: C.teal, fontSize: 14, flex: 1, lineHeight: 20 },
});
