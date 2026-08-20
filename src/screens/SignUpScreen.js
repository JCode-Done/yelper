import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import PasswordInput from '../components/PasswordInput';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  const allFieldsFilled =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0;

  const handleNext = () => {
    setError(null);
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUsername) {
      setError('Enter a username.');
      return;
    }
    if (!trimmedEmail) {
      setError('Enter your email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    navigation.navigate('Subscription', {
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join GameTap to discover board games
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={(t) => {
                setError(null);
                setUsername(t);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(t) => {
                setError(null);
                setEmail(t);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <PasswordInput
              value={password}
              onChangeText={(t) => {
                setError(null);
                setPassword(t);
              }}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              textColor={colors.textPrimary}
              borderColor={colors.border}
              backgroundColor={colors.card}
              iconColor={colors.textSecondary}
              style={styles.fieldSpacing}
            />
            <PasswordInput
              value={confirmPassword}
              onChangeText={(t) => {
                setError(null);
                setConfirmPassword(t);
              }}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              textColor={colors.textPrimary}
              borderColor={colors.border}
              backgroundColor={colors.card}
              iconColor={colors.textSecondary}
              style={styles.fieldSpacing}
            />

            {error ? (
              <Text style={[styles.errorText, { color: '#B91C1C' }]}>{error}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.textPrimary },
                pressed && allFieldsFilled && styles.buttonPressed,
                !allFieldsFilled && styles.buttonDisabled,
              ]}
              onPress={handleNext}
              disabled={!allFieldsFilled}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Next</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.linkText}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  fieldSpacing: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    fontSize: 16,
    color: '#3B82F6',
  },
});

export default SignUpScreen;
