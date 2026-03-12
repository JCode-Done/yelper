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
            <Ionicons name={cat.icon} size={18} color="#4B5563" />
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
    marginTop: 8,
  },
  item: {
    alignItems: 'center',
    width: 60,
  },
  itemGap: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPressed: {
    opacity: 0.7,
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CategoryIcons;
