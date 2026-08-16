import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Palette, S } from '@/src/theme';
import { useTheme } from '@/src/store';
import { PrimaryBtn, BrandMark } from '@/src/components';

export default function Landing() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <BrandMark size={88} />
        <Text style={styles.wordmark} testID="brand-name">Renewly</Text>
        <Text style={styles.tagline}>Know before it renews.</Text>
        <Text style={styles.blurb}>
          Every UPI Autopay, card mandate and app subscription — tracked in one place, with a nudge before money leaves your account.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryBtn
          testID="landing-signup"
          label="Create account"
          onPress={() => router.push({ pathname: '/auth', params: { mode: 'signup' } } as any)}
        />
        <Pressable
          testID="landing-signin"
          onPress={() => { Haptics.selectionAsync(); router.push({ pathname: '/auth', params: { mode: 'signin' } } as any); }}
          style={{ alignItems: 'center', padding: 12, marginTop: 8 }}
        >
          <Text style={{ color: C.sub, fontSize: 14 }}>
            Already tracking with us? <Text style={{ color: C.teal, fontWeight: '700' }}>Sign in</Text>
          </Text>
        </Pressable>
        <Text style={styles.legal}>Made for India · UPI-first · Free to start</Text>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  wordmark: { color: C.text, fontSize: 36, fontWeight: '800', marginTop: 20, letterSpacing: -0.5 },
  tagline: { color: C.teal, fontSize: 16, fontWeight: '700', marginTop: 6 },
  blurb: { color: C.sub, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 16 },
  footer: { paddingHorizontal: S.pad, paddingBottom: 12 },
  legal: { color: C.sub, fontSize: 11, textAlign: 'center', marginTop: 12, opacity: 0.8 },
});
