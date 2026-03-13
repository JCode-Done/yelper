import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ label = 'Dark mode' }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary },
        ]}
      >
        {label}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#D1D5DB', true: colors.switchTrackOn }}
        thumbColor={isDark ? colors.switchThumbOn : colors.switchThumbOn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ThemeToggle;

