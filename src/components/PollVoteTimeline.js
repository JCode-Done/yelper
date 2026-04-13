import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { formatPollTime } from '../utils/pollTime';

const PollVoteTimeline = ({ events, poll, colors, isDark }) => {
  if (!poll) return null;

  const renderItem = ({ item }) => {
    const label = poll.items[item.optionIndex] ?? `Option ${item.optionIndex + 1}`;
    return (
      <View
        style={[
          styles.row,
          {
            borderBottomColor: colors.border,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          },
        ]}
      >
        <View style={styles.dot} />
        <View style={styles.body}>
          <Text style={[styles.line, { color: colors.textPrimary }]}>
            <Text style={styles.name}>{item.voterName || 'Someone'}</Text>
            {' voted for '}
            <Text style={styles.game}>{label}</Text>
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatPollTime(item.votedAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Vote history
      </Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Newest first — tracked by time as votes arrive
      </Text>
      <FlatList
        data={events}
        keyExtractor={(item, index) => item.id ?? `ev-${index}`}
        renderItem={renderItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No votes yet. Be the first.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginTop: 6,
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  line: {
    fontSize: 14,
    lineHeight: 20,
  },
  name: {
    fontWeight: '700',
  },
  game: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default PollVoteTimeline;
