import React, { useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S } from '@/src/theme';
import { useTheme } from '@/src/store';
import { PrimaryBtn } from '@/src/components';

const FRAMES = [
  {
    key: 'f1',
    accent: 'teal' as const,
    icon: 'wallet' as const,
    headline: 'Subscriptions add up quietly.',
    sub: 'The average person has 8 recurring payments and forgets at least 2 of them.',
    cta: 'Next',
  },
  {
    key: 'f2',
    accent: 'amber' as const,
    icon: 'calendar' as const,
    headline: 'Renewly tells you before it renews.',
    sub: 'See every Autopay, card mandate and app subscription in one calendar.',
    cta: 'Next',
  },
  {
    key: 'f3',
    accent: 'teal' as const,
    icon: 'shield-checkmark' as const,
    headline: 'Let us do the finding.',
    sub: "Allow SMS access to auto-detect debits, or add them yourself in 30 seconds.",
    cta: 'Allow SMS access',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { width } = useWindowDimensions();
  const [i, setI] = useState(0);
  const ref = useRef<FlatList>(null);

  const goHome = () => router.replace('/home' as any);

  const next = () => {
    Haptics.selectionAsync();
    if (i < FRAMES.length - 1) {
      const ni = i + 1;
      setI(ni);
      ref.current?.scrollToIndex({ index: ni, animated: true });
    } else {
      goHome();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        ref={ref}
        data={FRAMES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => it.key}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => {
          const accent = item.accent === 'amber' ? C.amber : C.teal;
          return (
            <View style={{ width, paddingHorizontal: S.pad }}>
              <View style={styles.illWrap}>
                <View style={[styles.illCircle, { backgroundColor: accent + '22' }]}>
                  <Ionicons name={item.icon} size={72} color={accent} />
                </View>
                <View style={[styles.blob, { backgroundColor: C.amber + '33', top: 20, left: 30 }]} />
                <View style={[styles.blob, { backgroundColor: C.teal + '33', bottom: 30, right: 20, width: 40, height: 40 }]} />
              </View>
              <Text style={styles.h1}>{item.headline}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
            </View>
          );
        }}
      />

      <View style={styles.dots}>
        {FRAMES.map((_, idx) => (
          <View key={idx} style={[styles.dot, idx === i && { backgroundColor: C.teal, width: 20 }]} />
        ))}
      </View>

      <View style={{ paddingHorizontal: S.pad, paddingBottom: 8 }}>
        <PrimaryBtn testID={`onboarding-cta-${i}`} label={FRAMES[i].cta} onPress={next} />
        {i === FRAMES.length - 1 && (
          <Pressable testID="onboarding-skip" onPress={() => { Haptics.selectionAsync(); goHome(); }} style={{ marginTop: 12, alignItems: 'center', padding: 8 }}>
            <Text style={{ color: C.teal, fontSize: 14, fontWeight: '600' }}>Skip, I'll add manually</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  illWrap: { height: 260, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  illCircle: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  blob: { width: 24, height: 24, borderRadius: 12, position: 'absolute' },
  h1: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 32, textAlign: 'left' },
  sub: { fontSize: 15, color: C.sub, marginTop: 12, lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
});
