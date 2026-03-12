import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Reusable badge component
 * @param {Object} props
 * @param {string} props.label - Badge text
 * @param {Object} [props.style] - Optional style overrides
 */
const Badge = ({ label, style }) => {
  if (!label) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Badge;
