import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  retrieveFromGameTapRtdb,
  subscribeGameTapRtdbNode,
  GAMETAP_RTDB_FETCH_PATH,
  isGameTapRealtimeDatabaseAvailable,
  getGameTapRtdbHost,
} from '../api/rtdbRetrieve';

const formatPayload = (data) => {
  if (data === null || data === undefined) return '';
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

const RetrieveScreen = () => {
  const { colors, isDark } = useTheme();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeGameTapRtdbNode(
      (data) => {
        setLoading(false);
        setRefreshing(false);
        setError(null);
        setPayload(data);
      },
      (err) => {
        setLoading(false);
        setRefreshing(false);
        setError(err?.message || 'Realtime Database error');
        setPayload(null);
      },
    );
    return () => unsub();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const { data, error: err } = await retrieveFromGameTapRtdb();
    setRefreshing(false);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setPayload(data);
  }, []);

  const rtdbReady = isGameTapRealtimeDatabaseAvailable();
  const host = getGameTapRtdbHost();
  const text = formatPayload(payload);
  const showEmpty = !loading && !error && payload === null;
  const showData =
    !loading &&
    !error &&
    payload !== null &&
    payload !== undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        GameTap Realtime Database
      </Text>
      {host ? (
        <Text style={[styles.host, { color: colors.textSecondary }]} selectable>
          {host}
        </Text>
      ) : (
        <Text style={[styles.host, { color: colors.textSecondary }]}>
          URL: set EXPO_PUBLIC_FIREBASE_DATABASE_URL or EXPO_PUBLIC_GAMETAP_RTDB_URL
        </Text>
      )}
      {rtdbReady && !error ? (
        <Text style={[styles.live, { color: '#2E7D32' }]}>
          Live sync to Realtime Database
        </Text>
      ) : null}
      <Text style={[styles.pathLabel, { color: colors.textSecondary }]}>
        Path
      </Text>
      <Text
        style={[styles.path, { color: colors.textPrimary }]}
        selectable
      >
        /{GAMETAP_RTDB_FETCH_PATH}
      </Text>

      {!rtdbReady && !loading ? (
        <View style={[styles.banner, { backgroundColor: isDark ? '#422006' : '#FEF3C7' }]}>
          <Text style={[styles.bannerText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
            Add your GameTap Realtime Database URL to `.env`, restart Expo, and ensure RTDB
            rules allow read access.
          </Text>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      ) : null}

      {error ? (
        <View style={[styles.banner, { backgroundColor: isDark ? '#450A0A' : '#FEE2E2' }]}>
          <Text style={[styles.bannerText, { color: isDark ? '#FECACA' : '#991B1B' }]}>
            {error}
          </Text>
        </View>
      ) : null}

      {!loading ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.textPrimary}
            />
          }
        >
          {showEmpty ? (
            <Text style={[styles.empty, { color: colors.textSecondary }]}>
              No data at this path (missing or empty node).
            </Text>
          ) : null}
          {showData ? (
            <Text
              style={[
                styles.json,
                {
                  color: colors.textPrimary,
                  backgroundColor: isDark ? '#0F172A' : '#F3F4F6',
                },
              ]}
              selectable
            >
              {text}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
};

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  host: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily: mono,
  },
  live: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  pathLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  path: {
    fontSize: 13,
    fontFamily: mono,
    paddingHorizontal: 16,
    paddingBottom: 10,
    lineHeight: 18,
  },
  centered: {
    padding: 24,
    alignItems: 'center',
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  empty: {
    paddingTop: 8,
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  json: {
    fontSize: 12,
    fontFamily: mono,
    padding: 12,
    borderRadius: 10,
    lineHeight: 18,
  },
});

export default RetrieveScreen;
