import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  POLL_OPTION_COUNT,
  POLL_MIN_OPTIONS,
  DEFAULT_TARGET_TOTAL_VOTES,
  createPoll,
  getPollDuplicateErrorFromSlots,
  getPollDuplicateIndices,
  POLL_DUPLICATE_ENTRY_ERROR,
} from '../api/polls';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

const BoardGamePollCreator = ({ onCreated, onCancel }) => {
  const { colors, isDark } = useTheme();
  const { name, voterId } = useProfile();
  const [theme, setTheme] = useState('');
  const [items, setItems] = useState(() =>
    Array.from({ length: POLL_OPTION_COUNT }, () => ''),
  );
  const [targetStr, setTargetStr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const setItemAt = (index, text) => {
    setError(null);
    setItems((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const filledCount = items.filter((s) => (s || '').trim().length > 0).length;
  const themeOk = (theme || '').trim().length > 0;
  const targetParsed = parseInt((targetStr || '').trim(), 10);
  const targetOk = Number.isFinite(targetParsed) && targetParsed > 0;
  const duplicateError = getPollDuplicateErrorFromSlots(items);
  const duplicateIndices = getPollDuplicateIndices(items);
  const canCreate =
    themeOk &&
    targetOk &&
    filledCount >= POLL_MIN_OPTIONS &&
    !duplicateError;

  const handleSubmit = async () => {
    setError(null);
    if (!targetOk) {
      setError('Enter a target total vote count (100% goal).');
      return;
    }
    const cap = targetParsed;
    setBusy(true);
    const { pollId, error: err } = await createPoll({
      theme,
      items,
      createdByName: name,
      createdByVoterId: voterId || '',
      targetTotalVotes: cap,
    });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    onCreated?.(pollId);
  };

  const inputStyle = [
    styles.input,
    {
      borderColor: colors.border,
      color: colors.textPrimary,
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
    },
  ];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Poll theme
      </Text>
      <TextInput
        style={inputStyle}
        placeholder="e.g. Best gateway games for new players"
        placeholderTextColor={colors.textSecondary}
        value={theme}
        onChangeText={(t) => {
          setError(null);
          setTheme(t);
        }}
      />

      <Text style={[styles.label, styles.spaced, { color: colors.textSecondary }]}>
        Target total votes (100%)
      </Text>
      <TextInput
        style={inputStyle}
        placeholder={String(DEFAULT_TARGET_TOTAL_VOTES)}
        placeholderTextColor={colors.textSecondary}
        value={targetStr}
        onChangeText={(t) => {
          setError(null);
          setTargetStr(t);
        }}
        keyboardType="number-pad"
      />
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Enter the number of collective votes that count as 100% (e.g.{' '}
        {DEFAULT_TARGET_TOTAL_VOTES}). Required to create the poll.
      </Text>

      <Text style={[styles.label, styles.spaced, { color: colors.textSecondary }]}>
        Up to {POLL_OPTION_COUNT} board games
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        At least {POLL_MIN_OPTIONS} names required; leave unused rows blank.
      </Text>
      {items.map((val, i) => {
        const isDup = duplicateIndices.has(i);
        return (
          <View key={i} style={styles.gameField}>
            <View style={styles.gameRow}>
              <Text style={[styles.gameIndex, { color: colors.textSecondary }]}>
                {i + 1}
              </Text>
              <TextInput
                style={[
                  inputStyle,
                  styles.gameInput,
                  isDup && styles.inputDuplicate,
                ]}
                placeholder={`Game ${i + 1}`}
                placeholderTextColor={colors.textSecondary}
                value={val}
                onChangeText={(t) => setItemAt(i, t)}
                autoCapitalize="words"
              />
            </View>
            {isDup ? (
              <Text style={styles.errorBelowField}>
                {POLL_DUPLICATE_ENTRY_ERROR}
              </Text>
            ) : null}
          </View>
        );
      })}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <View style={styles.actions}>
        {onCancel ? (
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.secondary,
              { borderColor: colors.border },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={handleSubmit}
          disabled={busy || !canCreate}
          style={({ pressed }) => [
            styles.primary,
            {
              backgroundColor: isDark ? '#E5E7EB' : '#111827',
              opacity: !canCreate || busy ? 0.45 : 1,
            },
            pressed && canCreate && !busy && { opacity: 0.88 },
          ]}
        >
          {busy ? (
            <ActivityIndicator color={isDark ? '#111827' : '#F9FAFB'} />
          ) : (
            <Text
              style={[
                styles.primaryText,
                { color: isDark ? '#111827' : '#F9FAFB' },
              ]}
            >
              Create poll
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  body: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  spaced: {
    marginTop: 20,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 17,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
  },
  gameField: {
    marginBottom: 10,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputDuplicate: {
    borderColor: '#B91C1C',
    borderWidth: 2,
  },
  errorBelowField: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 32,
    lineHeight: 16,
  },
  gameIndex: {
    width: 22,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  gameInput: {
    flex: 1,
  },
  error: {
    color: '#B91C1C',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  secondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BoardGamePollCreator;
