import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C, S, R } from '@/src/theme';
import { ADD_GRID } from '@/src/data';
import { BottomNav, Logo, TopBar } from '@/src/components';

export default function Add() {
  const router = useRouter();
  const [q, setQ] = useState('');

  const tiles = useMemo(() => {
    if (!q.trim()) return ADD_GRID;
    return ADD_GRID.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const onTile = (id: string) => {
    Haptics.selectionAsync();
    router.push({ pathname: '/add-details', params: { id } } as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="Add a subscription" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: S.pad, paddingBottom: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={C.sub} />
          <TextInput
            testID="add-search"
            value={q}
            onChangeText={setQ}
            placeholder="Search Netflix, Jio, gym…"
            placeholderTextColor={C.sub}
            style={styles.searchInp}
          />
        </View>

        <View style={styles.grid}>
          {tiles.map(t => (
            <Pressable
              key={t.id}
              testID={`add-tile-${t.id}`}
              onPress={() => onTile(t.id)}
              style={({ pressed }) => [styles.tile, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Logo letter={t.logo} color={t.color} size={48} dashed={t.id === 'custom'} />
              <Text style={styles.tileName} numberOfLines={1}>{t.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="add" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.card, borderRadius: R.card, paddingHorizontal: 12, height: 44,
    borderWidth: 1, borderColor: C.divider,
  },
  searchInp: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, gap: 12, justifyContent: 'space-between' },
  tile: {
    width: '31%', aspectRatio: 1, borderRadius: R.card, backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center', padding: 8, gap: 8,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  tileName: { color: C.text, fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
