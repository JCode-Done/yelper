import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ onSearchSubmit, placeholder = 'Search restaurants, bars, etc.' }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (term.trim()) {
      onSearchSubmit?.(term.trim());
    }
  };

  return (
    <View style={styles.background}>
      <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={term}
        onChangeText={setTerm}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {term.length > 0 && (
        <Pressable onPress={() => setTerm('')} hitSlop={8} style={styles.clear}>
          <Feather name="x-circle" size={18} color="#6B7280" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#E5E5E5',
    height: 50,
    borderRadius: 8,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
});

export default SearchBar;
