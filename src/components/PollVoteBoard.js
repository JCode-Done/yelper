import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PollVoteBoard = ({
  poll,
  colors,
  isDark,
  votingIndex,
  onVote,
  disabled,
}) => {
  if (!poll) return null;
  const locked = disabled || Boolean(poll.completedAt);

  return (
    <View style={styles.list}>
      {poll.items.map((name, index) => {
        if (!(name || '').trim()) return null;
        const count = poll.voteCounts[index] ?? 0;
        const busy = votingIndex === index;
        return (
          <View
            key={`${index}-${name}`}
            style={[
              styles.row,
              {
                backgroundColor: isDark ? '#111827' : '#F9FAFB',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.rowMain}>
              <Text style={[styles.index, { color: colors.textSecondary }]}>
                {index + 1}.
              </Text>
              <Text
                style={[styles.name, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {name}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.badge, { color: colors.textSecondary }]}>
                {count} {count === 1 ? 'vote' : 'votes'}
              </Text>
              <Pressable
                onPress={() => onVote(index)}
                disabled={locked || busy}
                style={({ pressed }) => [
                  styles.voteBtn,
                  {
                    backgroundColor: locked
                      ? isDark
                        ? '#374151'
                        : '#D1D5DB'
                      : pressed
                        ? '#000000'
                        : '#111827',
                  },
                ]}
              >
                {busy ? (
                  <ActivityIndicator color="#F9FAFB" size="small" />
                ) : (
                  <>
                    <Ionicons name="arrow-up-circle" size={18} color="#F9FAFB" />
                    <Text style={styles.voteBtnText}>Vote</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingRight: 8,
  },
  index: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 22,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    fontSize: 12,
    fontWeight: '500',
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 88,
    justifyContent: 'center',
  },
  voteBtnText: {
    color: '#F9FAFB',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default PollVoteBoard;
