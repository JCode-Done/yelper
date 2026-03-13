import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryIcons from './CategoryIcons';

const SearchBar = ({
  onSearchSubmit,
  onSearchChange,
  onFilterPress,
  onCategoryPress,
  placeholder = 'Search board games...',
  value,
  isDark = false,
}) => {
  const [term, setTerm] = useState('');
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : term;

  const handleChangeText = (text) => {
    if (!isControlled) setTerm(text);
    onSearchChange?.(text);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    const t = inputValue?.trim() ?? '';
    if (t) {
      onSearchSubmit?.(t);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDark && styles.containerDark,
      ]}
    >
      <View style={styles.row}>
      <View
        style={[
          styles.background,
          isDark && styles.backgroundDark,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
          <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={inputValue}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {(inputValue?.length ?? 0) > 0 && (
          <Pressable
            onPress={() => {
              if (!isControlled) setTerm('');
              onSearchChange?.('');
            }}
            hitSlop={8}
            style={[styles.clear, styles.iconWrapper]}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={onFilterPress}
        hitSlop={8}
        style={styles.filter}
      >
        <View
          style={[
            styles.filterCircle,
            isDark && styles.filterCircleDark,
          ]}
        >
          <Ionicons
            name="filter"
            size={20}
            color={isDark ? '#E5E7EB' : '#6B7280'}
          />
        </View>
      </Pressable>
      </View>
      <CategoryIcons onCategoryPress={onCategoryPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backgroundDark: {
    backgroundColor: '#111827',
  },
  iconWrapper: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  inputDark: {
    color: '#F9FAFB',
  },
  clear: {
    marginLeft: 8,
  },
  filter: {
    marginLeft: 8,
  },
  filterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCircleDark: {
    backgroundColor: '#111827',
  },
});

export default SearchBar;
