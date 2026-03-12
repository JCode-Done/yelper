import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CategoryIcons from './CategoryIcons';

const SearchBar = ({
  onSearchSubmit,
  onSearchChange,
  onFilterPress,
  onCategoryPress,
  placeholder = 'Search board games...',
}) => {
  const { width } = useWindowDimensions();
  const horizontalMargin = Math.max(12, Math.min(width * 0.04, 24));
  const [term, setTerm] = useState('');

  const handleChangeText = (text) => {
    setTerm(text);
    onSearchChange?.(text);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (term.trim()) {
      onSearchSubmit?.(term.trim());
    }
  };

  return (
    <View style={[styles.container, { marginHorizontal: horizontalMargin }]}>
      <View style={styles.row}>
      <View style={styles.background}>
        <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={term}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {term.length > 0 && (
          <Pressable
            onPress={() => {
              setTerm('');
              onSearchChange?.('');
            }}
            hitSlop={8}
            style={styles.clear}
          >
            <Feather name="x-circle" size={18} color="#6B7280" />
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={onFilterPress}
        hitSlop={8}
        style={styles.filter}
      >
        <View style={styles.filterCircle}>
          <Feather name="filter" size={20} color="#6B7280" />
        </View>
      </Pressable>
      </View>
      <CategoryIcons onCategoryPress={onCategoryPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 15,
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
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
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
});

export default SearchBar;
