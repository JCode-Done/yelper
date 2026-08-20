import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useTheme } from "../context/ThemeContext";
import { loadStripe } from "../utils/loadStripe";

let functions;
try {
  const { getFunctions } = require("firebase/functions");
  const { app } = require("../config/firebase");
  if (app) functions = getFunctions(app);
} catch {
  // Functions not available (e.g. Firebase not configured)
}

const STRIPE_PK = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, email, password } = route.params || {};
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const { offerings, purchaseSubscription, restorePurchases } =
    useSubscription();

  const [busy, setBusy] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const packages = offerings?.availablePackages || [];

  const handleMobileSubscribe = async () => {
    setError(null);
    setBusy(true);
    try {
      if (email && password) {
        await signUp(email, password, username);
      }

      const pkg = selectedPkg || packages[0];
      if (!pkg) {
        setError("No subscription packages available. Please try again later.");
        setBusy(false);
        return;
      }

      await purchaseSubscription(pkg);
    } catch (e) {
      if (e.userCancelled) {
        setBusy(false);
        return;
      }
      const msg =
        e.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : e.code === "auth/invalid-email"
            ? "Please enter a valid email address."
            : e.code === "auth/weak-password"
              ? "Password is too weak — use at least 6 characters."
              : e.message;
      setError(msg);
    }
    setBusy(false);
  };

  const handleWebSubscribe = async () => {
    setError(null);
    setBusy(true);
    try {
      if (email && password) {
        await signUp(email, password, username);
      }

      if (!functions) {
        setError("Payment service is not configured.");
        setBusy(false);
        return;
      }

      const createCheckoutSession = httpsCallable(
        functions,
        "createCheckoutSession",
      );
      const { data } = await createCheckoutSession();

      if (data?.url) {
        if (Platform.OS === "web" && loadStripe && STRIPE_PK) {
          window.location.href = data.url;
        } else {
          await Linking.openURL(data.url);
        }
      } else {
        setError("Could not create checkout session.");
      }
    } catch (e) {
      const msg =
        e.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : e.message;
      setError(msg);
    }
    setBusy(false);
  };

  const handleSubscribe =
    Platform.OS === "web" ? handleWebSubscribe : handleMobileSubscribe;

  const handleRestore = async () => {
    setRestoring(true);
    setError(null);
    try {
      const restored = await restorePurchases();
      if (!restored) {
        setError("No previous subscription found.");
      }
    } catch (e) {
      setError(e.message);
    }
    setRestoring(false);
  };

  const formatPrice = (pkg) => {
    if (!pkg?.product) return "";
    const { priceString, subscriptionPeriod } = pkg.product;
    const periodLabel =
      subscriptionPeriod === "P1M"
        ? "/month"
        : subscriptionPeriod === "P1Y"
          ? "/year"
          : subscriptionPeriod === "P1W"
            ? "/week"
            : "";
    return `${priceString}${periodLabel}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Go Premium
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Unlock all features with a subscription
            </Text>

            <View
              style={[
                styles.featureCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {[
                "Ad-free experience",
                "Unlimited polls",
                "Premium game data",
                "Priority support",
              ].map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  <Text
                    style={[styles.featureText, { color: colors.textPrimary }]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            {Platform.OS !== "web" && packages.length > 0 && (
              <View style={styles.packagesContainer}>
                {packages.map((pkg) => {
                  const isSelected =
                    selectedPkg?.identifier === pkg.identifier ||
                    (!selectedPkg && pkg === packages[0]);
                  return (
                    <Pressable
                      key={pkg.identifier}
                      style={[
                        styles.packageCard,
                        {
                          borderColor: isSelected ? "#3B82F6" : colors.border,
                          backgroundColor: isSelected
                            ? "#3B82F610"
                            : colors.card,
                        },
                      ]}
                      onPress={() => setSelectedPkg(pkg)}
                    >
                      <Text
                        style={[
                          styles.packageTitle,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {pkg.packageType === "MONTHLY"
                          ? "Monthly"
                          : pkg.packageType === "ANNUAL"
                            ? "Annual"
                            : pkg.product?.title || pkg.identifier}
                      </Text>
                      <Text
                        style={[
                          styles.packagePrice,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {formatPrice(pkg)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {Platform.OS === "web" && (
              <View
                style={[
                  styles.webPriceCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.webPriceLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Premium Subscription
                </Text>
                <Text
                  style={[styles.webPriceNote, { color: colors.textSecondary }]}
                >
                  You&apos;ll be redirected to our secure checkout
                </Text>
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubscribe}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {email ? "Subscribe & Sign Up" : "Subscribe Now"}
                </Text>
              )}
            </Pressable>

            {Platform.OS !== "web" && (
              <Pressable
                style={({ pressed }) => [
                  styles.restoreButton,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={handleRestore}
                disabled={restoring}
              >
                {restoring ? (
                  <ActivityIndicator
                    color={colors.textSecondary}
                    size="small"
                  />
                ) : (
                  <Text
                    style={[
                      styles.restoreText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Restore Purchases
                  </Text>
                )}
              </Pressable>
            )}

            <Text style={[styles.legalText, { color: colors.textSecondary }]}>
              {Platform.OS === "web"
                ? "Subscriptions are managed through Stripe. Cancel anytime from your account settings."
                : "Payment will be charged to your App Store or Google Play account. " +
                  "Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period."}
            </Text>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  featureCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
  },
  packagesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  packageCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  packagePrice: {
    fontSize: 17,
    fontWeight: "700",
  },
  webPriceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    gap: 6,
  },
  webPriceLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  webPriceNote: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
    color: "#B91C1C",
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
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  restoreText: {
    fontSize: 15,
    fontWeight: "500",
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
  },
});

export default SubscriptionScreen;
