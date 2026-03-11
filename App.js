import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';

import SearchScreen from './src/screens/SearchScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#E6F4FE' },
            headerTintColor: '#1a1a1a',
          }}
        >
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'Board Game Search' }}
          />
          <Stack.Screen
            name="GameDetail"
            component={GameDetailScreen}
            options={{
              presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
});
