import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const emptyForm = () => ({
  keyword: '',
  minPlayers: '',
  maxPlaytime: '',
});

const AddCustomFilter = ({ visible, onClose, onApply, initialFilters }) => {
  const { isDark, colors } = useTheme();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!visible) return;
    if (initialFilters) {
      setForm({
        keyword: initialFilters.keyword ?? '',
        minPlayers:
          initialFilters.minPlayers != null
            ? String(initialFilters.minPlayers)
            : '',
        maxPlaytime:
          initialFilters.maxPlaytime != null
            ? String(initialFilters.maxPlaytime)
            : '',
      });
    } else {
      setForm(emptyForm());
    }
  }, [visible, initialFilters]);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
      color: colors.textPrimary,
      borderColor: colors.border,
    },
  ];

  const parseOptionalInt = (s) => {
    const t = (s || '').trim();
    if (!t) return null;
    const n = parseInt(t, 10);
    return Number.isNaN(n) ? null : n;
  };

  const handleApply = () => {
    const keyword = (form.keyword || '').trim();
    const minPlayers = parseOptionalInt(form.minPlayers);
    const maxPlaytime = parseOptionalInt(form.maxPlaytime);
    const hasAny =
      keyword.length > 0 || minPlayers != null || maxPlaytime != null;
    onApply?.(
      hasAny
        ? {
            keyword: keyword || null,
            minPlayers,
            maxPlaytime,
          }
        : null,
    );
    onClose?.();
  };

  const handleClear = () => {
    setForm(emptyForm());
    onApply?.(null);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.flex,
          { backgroundColor: isDark ? '#020617' : colors.card },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border },
          ]}
        >
          <Pressable onPress={onClose} hitSlop={12} style={styles.headerBtn}>
            <Text style={[styles.headerBtnText, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Custom filters
          </Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Keyword or tag
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. cooperative, puzzle…"
            placeholderTextColor={colors.textSecondary}
            value={form.keyword}
            onChangeText={(keyword) => setForm((f) => ({ ...f, keyword }))}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[styles.label, styles.labelSpaced, { color: colors.textSecondary }]}>
            At least players
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. 3"
            placeholderTextColor={colors.textSecondary}
            value={form.minPlayers}
            onChangeText={(minPlayers) => setForm((f) => ({ ...f, minPlayers }))}
            keyboardType="number-pad"
          />

          <Text style={[styles.label, styles.labelSpaced, { color: colors.textSecondary }]}>
            Max playtime (minutes)
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. 60"
            placeholderTextColor={colors.textSecondary}
            value={form.maxPlaytime}
            onChangeText={(maxPlaytime) => setForm((f) => ({ ...f, maxPlaytime }))}
            keyboardType="number-pad"
          />

          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Filters apply to the current search results (name, tags, and stats when
            available).
          </Text>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
              backgroundColor: isDark ? '#020617' : colors.card,
            },
          ]}
        >
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: colors.border },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>
              Clear
            </Text>
          </Pressable>
          <Pressable
            onPress={handleApply}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: isDark ? '#E5E7EB' : '#111827' },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[
                styles.primaryBtnText,
                { color: isDark ? '#111827' : '#F9FAFB' },
              ]}
            >
              Apply
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    minWidth: 72,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    padding: 20,
    paddingBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddCustomFilter;
