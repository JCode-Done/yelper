import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import BoardGamePollCreator from '../components/BoardGamePollCreator';

const PollCreateScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <BoardGamePollCreator
        onCreated={(pollId) => {
          navigation.replace('PollDetail', { pollId });
        }}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});

export default PollCreateScreen;
