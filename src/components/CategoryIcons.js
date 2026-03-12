import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'card', label: 'Card games', icon: 'card-outline' },
  { id: 'strategy', label: 'Strategy', icon: 'bulb-outline' },
  { id: 'worker', label: 'Worker placement', icon: 'people-outline' },
  { id: 'abstract', label: 'Abstract', icon: 'grid-outline' },
  { id: 'euro', label: 'Euro', icon: 'globe-outline' },
  { id: 'ameritrash', label: 'Americitrash', icon: 'flash-outline' },
  { id: 'campaign', label: 'Campaign', icon: 'book-outline' },
  { id: 'trick', label: 'Trick taking', icon: 'layers-outline' },
];

const CategoryIcons = ({ onCategoryPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat, index) => (
        <Pressable
          key={cat.id}
          onPress={() => onCategoryPress?.(cat)}
          style={({ pressed }) => [
            styles.item,
            index < CATEGORIES.length - 1 && styles.itemGap,
            pressed && styles.itemPressed,
          ]}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name={cat.icon} size={28} color="#fff" />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {cat.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    paddingBottom: 4,
  },
  item: {
    alignItems: 'center',
    width: 72,
  },
  itemGap: {
    marginRight: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#5f5f5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPressed: {
    opacity: 0.7,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CategoryIcons;
