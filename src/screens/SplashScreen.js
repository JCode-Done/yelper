import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const blurOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  // start well above the screen so the logo "falls" in
  const logoTranslateY = useRef(new Animated.Value(-220)).current;
  const iconTilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(blurOpacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.sequence([
          // fall in from top
          Animated.timing(logoTranslateY, {
            toValue: 10,
            duration: 550,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          // small bounce to settle
          Animated.spring(logoTranslateY, {
            toValue: 0,
            friction: 5,
            tension: 140,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(iconTilt, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(iconTilt, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [blurOpacity, logoOpacity, logoScale, logoTranslateY, iconTilt]);

  const gradientColors = isDark
    ? ['#020617', '#000000']
    : ['#2a2a2a', '#000000'];

  const iconTiltStyle = {
    transform: [
      {
        rotateZ: iconTilt.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '12deg'],
        }),
      },
    ],
  };

  const logoContainerStyle = {
    opacity: logoOpacity,
    transform: [
      { scale: logoScale },
      { translateY: logoTranslateY },
    ],
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { opacity: blurOpacity }]}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={50}
          tint={isDark ? 'dark' : 'default'}
        />
      </Animated.View>

      <Animated.View style={[styles.content, logoContainerStyle]}>
        <Animated.View style={[styles.iconWrapper, iconTiltStyle]}>
          <FontAwesome5
            name="chess-knight"
            size={70}
            color="#fff"
          />
        </Animated.View>
        <Text style={styles.title}>GameTap</Text>
      </Animated.View>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.replace('SignIn')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default SplashScreen;
