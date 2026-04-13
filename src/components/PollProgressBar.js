import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  progressFraction,
  totalVotesFromCounts,
  DEFAULT_TARGET_TOTAL_VOTES,
} from '../api/polls';

const PollProgressBar = ({ poll, colors, isDark }) => {
  if (!poll) return null;
  const total = totalVotesFromCounts(poll.voteCounts);
  const cap = poll.targetTotalVotes || DEFAULT_TARGET_TOTAL_VOTES;
  const pct = Math.round(progressFraction(poll) * 100);
  const complete = Boolean(poll.completedAt);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Collective votes
        </Text>
        <Text style={[styles.count, { color: colors.textPrimary }]}>
          {total} / {cap}
          <Text style={[styles.pct, { color: colors.textSecondary }]}>
            {' '}
            ({pct}%)
          </Text>
        </Text>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: isDark ? '#1F2937' : '#E5E7EB' },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: complete ? '#2E7D32' : '#111827',
            },
          ]}
        />
      </View>
      {complete && (
        <Text style={[styles.complete, { color: '#2E7D32' }]}>
          Poll reached 100% — voting closed
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  count: {
    fontSize: 15,
    fontWeight: '700',
  },
  pct: {
    fontWeight: '500',
    fontSize: 14,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  complete: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PollProgressBar;
