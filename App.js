import React from 'react';
// Initialize Firebase (Firestore + optional RTDB) — config via EXPO_PUBLIC_* in `.env`
import './src/config/firebase';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import HomeScreen from './src/tabs/HomeScreen';
import FavoritesScreen from './src/tabs/FavoritesScreen';
import ProfileScreen from './src/tabs/ProfileScreen';
import VideosScreen from './src/tabs/VideosScreen';
import PollsStack from './src/navigation/PollsStack';
import RetrieveScreen from './src/tabs/RetrieveScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import SplashScreen from './src/screens/SplashScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ForgotUsernameScreen from './src/screens/ForgotUsernameScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Home: focused ? 'home' : 'home-outline',
            Favorites: focused ? 'heart' : 'heart-outline',
            Profile: focused ? 'person' : 'person-outline',
            Videos: focused ? 'videocam' : 'videocam-outline',
            Polls: focused ? 'bar-chart' : 'bar-chart-outline',
            Retrieve: focused ? 'cloud-download' : 'cloud-download-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
      <Tab.Screen name="Polls" component={PollsStack} />
      <Tab.Screen
        name="Retrieve"
        component={RetrieveScreen}
        options={{ title: 'Retrieve' }}
      />
    </Tab.Navigator>
  );
};

function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { user, initializing } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.textPrimary,
        }}
      >
        {initializing ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : user ? (
          <>
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
                sheetAllowedDetents: [0.7, 1],
                sheetInitialDetentIndex: 1,
                sheetGrabberVisible: true,
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
            <Stack.Screen
              name="Subscription"
              component={SubscriptionScreen}
              options={{
                presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotUsername"
              component={ForgotUsernameScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Subscription"
              component={SubscriptionScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <FavoritesProvider>
              <ProfileProvider>
                <AppNavigator />
              </ProfileProvider>
            </FavoritesProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
});
