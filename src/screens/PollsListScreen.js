import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  subscribePollList,
  progressFraction,
  isPollsCloudEnabled,
} from '../api/polls';
import { formatPollTime } from '../utils/pollTime';

const PollsListScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [polls, setPolls] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribePollList(setPolls);
    return unsub;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  };

  const renderItem = ({ item }) => {
    const pct = Math.round(progressFraction(item) * 100);
    const done = Boolean(item.completedAt);
    return (
      <Pressable
        onPress={() => navigation.navigate('PollDetail', { pollId: item.id })}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderColor: colors.border,
          },
          pressed && { opacity: 0.92 },
        ]}
      >
        <Text style={[styles.theme, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.theme}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            by {item.createdByName}
          </Text>
          {item.createdAt ? (
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              · {formatPollTime(item.createdAt)}
            </Text>
          ) : null}
        </View>
        <View style={styles.footer}>
          <Text
            style={[
              styles.status,
              { color: done ? '#2E7D32' : colors.textSecondary },
            ]}
          >
            {done ? 'Complete' : `${pct}% toward goal`}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  };

  const cloud = isPollsCloudEnabled();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!cloud ? (
        <View
          style={[
            styles.cloudBanner,
            {
              backgroundColor: isDark ? '#422006' : '#FEF3C7',
              borderColor: isDark ? '#78350F' : '#F59E0B',
            },
          ]}
        >
          <Text style={[styles.cloudBannerText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
            Polls are offline: add EXPO_PUBLIC_FIREBASE_* to `.env` (see
            `.env.example`), deploy `firestore.rules`, then restart Expo.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.cloudBanner,
            {
              backgroundColor: isDark ? '#14532D' : '#DCFCE7',
              borderColor: isDark ? '#166534' : '#22C55E',
            },
          ]}
        >
          <Text style={[styles.cloudBannerText, { color: isDark ? '#BBF7D0' : '#14532D' }]}>
            Polls synced to Firestore
          </Text>
        </View>
      )}
      <FlatList
        data={polls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No polls yet. Create one with two or more games (up to ten) and vote together
            until the bar hits 100%.
          </Text>
        }
      />
      <Pressable
        onPress={() => navigation.navigate('PollCreate')}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: isDark ? '#E5E7EB' : '#111827' },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Ionicons name="add" size={28} color={isDark ? '#111827' : '#F9FAFB'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cloudBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cloudBannerText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  theme: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  meta: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    paddingHorizontal: 24,
    fontSize: 15,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default PollsListScreen;
