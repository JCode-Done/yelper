import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import PollsListScreen from '../screens/PollsListScreen';
import PollCreateScreen from '../screens/PollCreateScreen';
import PollDetailScreen from '../screens/PollDetailScreen';

const Stack = createNativeStackNavigator();

const PollsStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="PollsList"
        component={PollsListScreen}
        options={{ title: 'Board game polls' }}
      />
      <Stack.Screen
        name="PollCreate"
        component={PollCreateScreen}
        options={{ title: 'New poll' }}
      />
      <Stack.Screen
        name="PollDetail"
        component={PollDetailScreen}
        options={{ title: 'Poll' }}
      />
    </Stack.Navigator>
  );
};

export default PollsStack;
