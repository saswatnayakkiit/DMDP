import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Palette, S, R, inr, shadow } from '@/src/theme';
import { ADD_GRID } from '@/src/data';
import { useTheme } from '@/src/store';
import { PrimaryBtn, Logo, TopBar } from '@/src/components';

const CYCLES = ['Monthly', 'Yearly', 'Weekly'];
const METHODS = ['UPI Autopay', 'Card', 'Net banking', 'Cash'];
const REMIND = ['1 day before', '3 days before', '7 days before'];
const SPLIT = ['2 people', '3 people', '4 people'];

const DEFAULTS: Record<string, { amount: number; date: string }> = {
  netflix: { amount: 649, date: '19 Sep 2026' },
  spotify: { amount: 119, date: '21 Sep 2026' },
  hotstar: { amount: 299, date: '3 Oct 2026' },
  ytpremium: { amount: 149, date: '5 Oct 2026' },
  prime: { amount: 299, date: '25 Sep 2026' },
  jio: { amount: 399, date: '15 Oct 2026' },
  airtel: { amount: 399, date: '18 Oct 2026' },
  cultfit: { amount: 1499, date: '28 Sep 2026' },
  icloud: { amount: 75, date: '12 Oct 2026' },
  chatgpt: { amount: 1999, date: '22 Oct 2026' },
  custom: { amount: 0, date: '1 Oct 2026' },
};

export default function AddDetails() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const svc = ADD_GRID.find(t => t.id === id) ?? ADD_GRID[3];
  const def = DEFAULTS[svc.id] ?? { amount: 0, date: '1 Oct 2026' };

  const [amount] = useState(def.amount);
  const [cycle, setCycle] = useState('Monthly');
  const [date] = useState(def.date);
  const [method, setMethod] = useState<string>('Card');
  const [shared, setShared] = useState(false);
  const [split, setSplit] = useState('2 people');
  const [remind, setRemind] = useState('3 days before');

  // simple picker: cycle through options on tap
  const cyc = (arr: string[], cur: string, set: (v: string) => void) => () => {
    Haptics.selectionAsync();
    const i = arr.indexOf(cur);
    set(arr[(i + 1) % arr.length]);
  };

  const save = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/home' as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Add subscription" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={styles.svcHeader}>
            <Logo letter={svc.logo} color={svc.color} size={56} dashed={svc.id === 'custom'} />
            <Text style={styles.svcName}>{svc.name}</Text>
          </View>

          <FieldRow styles={styles} C={C} label="Amount" value={amount ? inr(amount) : 'Enter amount'} />
          <FieldRow styles={styles} C={C} label="Billing cycle" value={cycle} chevron onPress={cyc(CYCLES, cycle, setCycle)} />
          <FieldRow styles={styles} C={C} label="Next debit" value={date} chevron />
          <FieldRow styles={styles} C={C} label="Paid via" value={method} chevron onPress={cyc(METHODS, method, setMethod)} testID="field-method" />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.lbl}>Shared with others</Text>
              <Text style={styles.hint}>Split cost with friends or family</Text>
            </View>
            <Switch
              testID="toggle-shared"
              value={shared}
              onValueChange={(v) => { Haptics.selectionAsync(); setShared(v); }}
              trackColor={{ false: C.border, true: C.teal }}
              thumbColor="#fff"
            />
          </View>

          {shared && (
            <FieldRow styles={styles} C={C} label="Split between" value={split} chevron onPress={cyc(SPLIT, split, setSplit)} />
          )}

          <FieldRow styles={styles} C={C} label="Remind me" value={remind} chevron onPress={cyc(REMIND, remind, setRemind)} />
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryBtn testID="save-sub" label="Save subscription" onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldRow({ label, value, chevron, onPress, testID, styles, C }: { label: string; value: string; chevron?: boolean; onPress?: () => void; testID?: string; styles: any; C: Palette }) {
  const Comp: any = onPress ? Pressable : View;
  return (
    <Comp testID={testID} onPress={onPress} style={styles.field}>
      <Text style={styles.lbl}>{label}</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.val}>{value}</Text>
        {chevron && <Ionicons name="chevron-down" size={18} color={C.sub} />}
      </View>
    </Comp>
  );
}

const makeStyles = (C: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  svcHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  svcName: { color: C.text, fontSize: 22, fontWeight: '800' },
  field: {
    backgroundColor: C.card, borderRadius: R.card, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: C.cardBorder,
    ...shadow, shadowOpacity: 0.04,
  },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  lbl: { color: C.sub, fontSize: 12, fontWeight: '600' },
  val: { color: C.text, fontSize: 15, fontWeight: '700' },
  hint: { color: C.sub, fontSize: 11, marginTop: 2 },
  toggleRow: {
    backgroundColor: C.card, borderRadius: R.card, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: C.cardBorder,
    ...shadow, shadowOpacity: 0.04,
  },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: S.pad, paddingBottom: 24, backgroundColor: C.bg,
    borderTopWidth: 1, borderTopColor: C.divider,
  },
});
