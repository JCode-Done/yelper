import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  { id: 'card', label: 'Card games', icon: 'card-outline' },
  { id: 'strategy', label: 'Strategy', icon: 'bulb-outline' },
  { id: 'worker', label: 'Worker placement', icon: 'people-outline' },
  { id: 'abstract', label: 'Abstract', icon: 'grid-outline' },
  { id: 'euro', label: 'Euro', icon: 'globe-outline' },
  { id: 'ameritrash', label: 'Americitrash', icon: 'flash-outline' },
  { id: 'campaign', label: 'Campaign', icon: 'book-outline' },
  { id: 'trick', label: 'Trick taking', icon: 'layers-outline' },
  { id: 'area', label: 'Area Control', icon: 'map-outline' },
  { id: 'resourceManagement', label: 'Resource Management', icon: 'cash-outline' },
  { id: 'cooperative', label: 'Cooperative', icon: 'people-outline' },
];

const CategoryIcons = ({ onCategoryPress }) => {
  const { isDark, colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        isDark && { backgroundColor: colors.card },
      ]}
    >
      {CATEGORIES.map((cat, index) => (
        <Pressable
          key={cat.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Warning
            );
            onCategoryPress?.(cat);
          }}
          style={({ pressed }) => [
            styles.item,
            index < CATEGORIES.length - 1 && styles.itemGap,
            pressed && styles.itemPressed,
          ]}
        >
          <View style={styles.iconWrapper}>
            <Ionicons
              name={cat.icon}
              size={24}
              color={isDark ? colors.textSecondary : '#4B5563'}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isDark ? colors.textSecondary : '#6B7280' },
            ]}
            numberOfLines={2}
          >
            {cat.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    paddingBottom: 4,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  item: {
    alignItems: 'center',
    width: 58,
  },
  itemGap: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPressed: {
    opacity: 0.6,
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CategoryIcons;
