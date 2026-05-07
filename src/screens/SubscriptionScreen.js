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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const CARD_TYPES = [
  { label: 'Visa', icon: 'cc-visa' },
  { label: 'Mastercard', icon: 'cc-mastercard' },
  { label: 'Amex', icon: 'cc-amex' },
  { label: 'Discover', icon: 'cc-discover' },
];

const formatCardNumber = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, email, password } = route.params;

  const [nameOnCard, setNameOnCard] = useState('Jane Doe');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardType, setCardType] = useState('Visa');
  const [cvv, setCvv] = useState('123');
  const [expiry, setExpiry] = useState('12/29');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const { colors } = useTheme();
  const { signUp } = useAuth();


  const handleSubscribe = async () => {
    setError(null);
    setBusy(true);
    try {
      await signUp(email, password, username);
    } catch (e) {
      const msg =
        e.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : e.code === 'auth/invalid-email'
            ? 'Please enter a valid email address.'
            : e.code === 'auth/weak-password'
              ? 'Password is too weak — use at least 6 characters.'
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
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Subscription
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your payment details to subscribe
            </Text>

            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Name on Card
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
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              value={nameOnCard}
              onChangeText={(t) => {
                setError(null);
                setNameOnCard(t);
              }}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Card Number
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
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              value={cardNumber}
              onChangeText={(t) => {
                setError(null);
                setCardNumber(formatCardNumber(t));
              }}
              keyboardType="number-pad"
              maxLength={19}
            />

            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Card Type
            </Text>
            <View style={styles.cardTypeRow}>
              {CARD_TYPES.map(({ label, icon }) => {
                const selected = cardType === label;
                return (
                  <Pressable
                    key={label}
                    style={[
                      styles.cardTypeChip,
                      {
                        borderColor: selected ? '#3B82F6' : colors.border,
                        backgroundColor: selected ? '#3B82F6' : colors.card,
                      },
                    ]}
                    onPress={() => {
                      setError(null);
                      setCardType(label);
                    }}
                  >
                    <FontAwesome5
                      name={icon}
                      size={18}
                      color={selected ? '#fff' : colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.cardTypeText,
                        { color: selected ? '#fff' : colors.textPrimary },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Expiration
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
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary}
                  value={expiry}
                  onChangeText={(t) => {
                    setError(null);
                    setExpiry(formatExpiry(t));
                  }}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  CVV
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
                  placeholder="123"
                  placeholderTextColor={colors.textSecondary}
                  value={cvv}
                  onChangeText={(t) => {
                    setError(null);
                    setCvv(t.replace(/\D/g, '').slice(0, 3));
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: '#B91C1C' }]}>{error}</Text>
            ) : null}

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
                <Text style={styles.buttonText}>Subscribe & Sign Up</Text>
              )}
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  cardTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  cardTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SubscriptionScreen;
