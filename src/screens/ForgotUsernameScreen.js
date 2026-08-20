import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const ForgotUsernameScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={({ pressed }) => [
            styles.backLink,
            pressed && styles.linkPressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backLinkText, { color: colors.textSecondary }]}>
            ← Back to Sign in
          </Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Forgot email?
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Your account is tied to the email address you used when you signed up.
          Try the email addresses you commonly use. If you still can&apos;t
          remember, create a new account.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate("ForgotPassword", { email: "" })}
        >
          <Text style={styles.buttonText}>Reset password instead</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            pressed && styles.linkPressed,
          ]}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.linkText}>Create a new account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#3B82F6",
  },
  linkPressed: {
    opacity: 0.7,
  },
});

export default ForgotUsernameScreen;
