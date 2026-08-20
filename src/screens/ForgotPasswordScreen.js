import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialEmail =
    typeof route.params?.email === "string" ? route.params.email : "";
  const [email, setEmail] = useState(initialEmail.trim());
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const { colors } = useTheme();
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(trimmed);
      setSent(true);
    } catch (e) {
      const msg =
        e.code === "auth/user-not-found"
          ? "No account found with this email."
          : e.code === "auth/invalid-email"
            ? "Please enter a valid email address."
            : e.message;
      setError(msg);
    }
    setBusy(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.content}>
          <Pressable
            style={({ pressed }) => [
              styles.backLink,
              pressed && styles.linkPressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={[styles.backLinkText, { color: colors.textSecondary }]}
            >
              ← Back to Sign in
            </Text>
          </Pressable>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Reset password
          </Text>

          {sent ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              A password reset link has been sent to {email.trim()}. Check your
              inbox (and spam folder) then return here to sign in.
            </Text>
          ) : (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the email you used to create your account and we&apos;ll
              send you a link to reset your password.
            </Text>
          )}

          {!sent && (
            <>
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

              {error ? (
                <Text style={[styles.errorText, { color: "#B91C1C" }]}>
                  {error}
                </Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  busy && styles.buttonDisabled,
                ]}
                onPress={handleReset}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </Pressable>
            </>
          )}

          {sent && (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={styles.buttonText}>Back to Sign in</Text>
            </Pressable>
          )}
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
    paddingTop: 16,
  },
  backLink: {
    alignSelf: "flex-start",
    marginBottom: 24,
    paddingVertical: 4,
  },
  backLinkText: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  linkPressed: {
    opacity: 0.7,
  },
});

export default ForgotPasswordScreen;
