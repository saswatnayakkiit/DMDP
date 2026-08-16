import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, shadow } from '@/src/theme';
import { useTheme } from '@/src/store';
import { PrimaryBtn, TopBar, BrandMark } from '@/src/components';

export default function Auth() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<'signin' | 'signup'>(modeParam === 'signin' ? 'signin' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSignup = mode === 'signup';

  // Mock auth: sign-up goes through onboarding, sign-in lands on home.
  const submit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace((isSignup ? '/onboarding' : '/home') as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TopBar onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginTop: 4, marginBottom: 24 }}>
            <BrandMark size={56} />
            <Text style={styles.title}>{isSignup ? 'Create your account' : 'Welcome back'}</Text>
            <Text style={styles.subtitle}>
              {isSignup ? 'Start tracking renewals in under a minute.' : 'Your renewals missed you.'}
            </Text>
          </View>

          {isSignup && (
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={C.sub} />
              <TextInput
                testID="auth-name"
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={C.sub}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color={C.sub} />
            <TextInput
              testID="auth-email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={C.sub}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color={C.sub} />
            <TextInput
              testID="auth-password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={C.sub}
              style={styles.input}
              secureTextEntry
            />
          </View>

          {!isSignup && (
            <Pressable onPress={() => Haptics.selectionAsync()} style={{ alignSelf: 'flex-end', padding: 4, marginTop: 2 }}>
              <Text style={{ color: C.teal, fontSize: 13, fontWeight: '600' }}>Forgot password?</Text>
            </Pressable>
          )}

          <PrimaryBtn
            testID="auth-submit"
            label={isSignup ? 'Create account' : 'Sign in'}
            onPress={submit}
            style={{ marginTop: 16 }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={{ color: C.sub, fontSize: 12 }}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            testID="auth-google"
            onPress={() => { Haptics.selectionAsync(); submit(); }}
            style={({ pressed }) => [styles.googleBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="logo-google" size={18} color={C.text} />
            <Text style={{ color: C.text, fontSize: 15, fontWeight: '600' }}>Continue with Google</Text>
          </Pressable>

          <Pressable
            testID="auth-switch"
            onPress={() => { Haptics.selectionAsync(); setMode(isSignup ? 'signin' : 'signup'); }}
            style={{ alignItems: 'center', padding: 12, marginTop: 16 }}
          >
            <Text style={{ color: C.sub, fontSize: 14 }}>
              {isSignup ? 'Already have an account? ' : 'New to Renewly? '}
              <Text style={{ color: C.teal, fontWeight: '700' }}>{isSignup ? 'Sign in' : 'Create one'}</Text>
            </Text>
          </Pressable>

          <Text style={styles.terms}>
            By continuing you agree to our Terms & Privacy Policy. We never read your SMS content — only debit alerts.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  title: { color: C.text, fontSize: 24, fontWeight: '800', marginTop: 14 },
  subtitle: { color: C.sub, fontSize: 14, marginTop: 4 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.card, borderRadius: R.card, paddingHorizontal: 14, height: 52,
    borderWidth: 1, borderColor: C.cardBorder === 'transparent' ? C.divider : C.cardBorder,
    marginBottom: 12,
  },
  input: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 0 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.divider },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 48, borderRadius: R.card, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.cardBorder === 'transparent' ? C.border : C.cardBorder,
    ...shadow, shadowOpacity: 0.04,
  },
  terms: { color: C.sub, fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 16, opacity: 0.9 },
});
