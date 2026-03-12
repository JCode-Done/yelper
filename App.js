import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FavoritesProvider } from './src/context/FavoritesContext';
import HomeScreen from './src/tabs/HomeScreen';
import SearchScreen from './src/tabs/SearchScreen';
import FavoritesScreen from './src/tabs/FavoritesScreen';
import ProfileScreen from './src/tabs/ProfileScreen';
import VideosScreen from './src/tabs/VideosScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#E6F4FE' },
      headerTintColor: '#1a1a1a',
      tabBarStyle: { backgroundColor: 'rgba(0,0,0,0.85)' },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
      tabBarIcon: ({ focused, color, size }) => {
        const iconMap = {
          Home: focused ? 'home' : 'home-outline',
          BoardGameSearch: focused ? 'search' : 'search-outline',
          Favorites: focused ? 'heart' : 'heart-outline',
          Profile: focused ? 'person' : 'person-outline',
          Videos: focused ? 'videocam' : 'videocam-outline',
        };
        return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen
      name="BoardGameSearch"
      component={SearchScreen}
      options={{ title: 'Board Game Search' }}
    />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Videos" component={VideosScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <FavoritesProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#E6F4FE' },
              headerTintColor: '#1a1a1a',
            }}
          >
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GameDetail"
              component={GameDetailScreen}
              options={{
                presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="VideoPlayer"
              component={VideoPlayerScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
});
