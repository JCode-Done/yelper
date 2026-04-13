import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import {
  subscribePoll,
  subscribePollEvents,
  castVote,
} from '../api/polls';
import PollProgressBar from '../components/PollProgressBar';
import PollVoteBoard from '../components/PollVoteBoard';
import PollVoteTimeline from '../components/PollVoteTimeline';
import { formatPollTime } from '../utils/pollTime';

const PollDetailScreen = () => {
  const route = useRoute();
  const pollId = route.params?.pollId;
  const { colors, isDark } = useTheme();
  const { name, voterId } = useProfile();
  const [poll, setPoll] = useState(null);
  const [events, setEvents] = useState([]);
  const [votingIndex, setVotingIndex] = useState(null);

  useEffect(() => {
    if (!pollId) return undefined;
    const unsubPoll = subscribePoll(pollId, setPoll);
    const unsubEv = subscribePollEvents(pollId, setEvents);
    return () => {
      unsubPoll();
      unsubEv();
    };
  }, [pollId]);

  const onVote = useCallback(
    async (optionIndex) => {
      if (!pollId || !poll || poll.completedAt) return;
      setVotingIndex(optionIndex);
      const { ok, error } = await castVote(pollId, optionIndex, {
        voterId: voterId || '',
        voterName: name || 'Guest',
      });
      setVotingIndex(null);
      if (!ok && error) {
        Alert.alert('Vote not counted', error);
      }
    },
    [pollId, poll, voterId, name],
  );

  if (!pollId) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Missing poll.</Text>
      </View>
    );
  }

  if (!poll) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Loading poll…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.body}
    >
      <Text style={[styles.theme, { color: colors.textPrimary }]}>
        {poll.theme}
      </Text>
      <Text style={[styles.byline, { color: colors.textSecondary }]}>
        Created by {poll.createdByName}
        {poll.createdAt ? ` · ${formatPollTime(poll.createdAt)}` : ''}
      </Text>

      <PollProgressBar poll={poll} colors={colors} isDark={isDark} />

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Cast your vote
      </Text>
      <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
        Everyone can vote; totals update live. One tap adds one vote to that game.
      </Text>

      <PollVoteBoard
        poll={poll}
        colors={colors}
        isDark={isDark}
        votingIndex={votingIndex}
        onVote={onVote}
        disabled={!voterId}
      />

      {!voterId ? (
        <Text style={[styles.warn, { color: colors.textSecondary }]}>
          Preparing your voter id…
        </Text>
      ) : null}

      <PollVoteTimeline
        events={events}
        poll={poll}
        colors={colors}
        isDark={isDark}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  body: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  theme: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 28,
  },
  byline: {
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  warn: {
    marginTop: 12,
    fontSize: 13,
  },
});

export default PollDetailScreen;
