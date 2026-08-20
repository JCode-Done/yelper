import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PasswordInput = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  textColor,
  borderColor,
  backgroundColor,
  iconColor,
  style,
  editable = true,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
      />
      <Pressable
        style={styles.eye}
        onPress={() => setVisible((v) => !v)}
        hitSlop={12}
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      >
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  eye: {
    padding: 8,
  },
});

export default PasswordInput;
