import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View style={styles.background}>
      <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
      <Text style={styles.placeholder}>Search Bar</Text>
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
  placeholder: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export default SearchBar;