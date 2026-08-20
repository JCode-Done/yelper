import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const { colors } = useTheme();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Enter your email.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setBusy(true);
    try {
      await signIn(trimmedEmail, password);
    } catch (e) {
      const msg =
        e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : e.code === 'auth/invalid-email'
            ? 'Please enter a valid email address.'
            : e.code === 'auth/too-many-requests'
              ? 'Too many attempts — please try again later.'
              : e.message;
      setError(msg);
      setBusy(false);
      return;
    }
    setBusy(false);
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
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Sign In
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, marginBottom: 32 },
            ]}
          >
            Welcome back to GameTap
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

          <View style={styles.recoveryRow}>
            <Pressable
              style={({ pressed }) => [styles.recoveryLink, pressed && styles.linkPressed]}
              onPress={() => navigation.navigate('ForgotUsername')}
            >
              <Text style={styles.linkText}>Forgot username?</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.recoveryLink, pressed && styles.linkPressed]}
              onPress={() =>
                navigation.navigate('ForgotPassword', { email: email.trim() })
              }
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </Pressable>
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: '#B91C1C' }]}>{error}</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.textPrimary },
              pressed && styles.buttonPressed,
              busy && styles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>Sign In</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.linkText}>
              {"Don't have an account? Sign up"}
            </Text>
          </Pressable>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 8,
  },
  recoveryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recoveryLink: {
    paddingVertical: 4,
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

export default SignInScreen;
