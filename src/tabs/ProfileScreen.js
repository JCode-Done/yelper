import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=boardgamer&backgroundColor=2E7D32';

const ProfileScreen = () => {
  const name = 'Alex Rivera';
  const yearsGaming = 8;
  const title = 'Board Game Enthusiast';
  const bio =
    'I\'ve been collecting and playing board games since college. Favorites include Wingspan, Terraforming Mars, and Catan. Always looking to discover new titles and connect with fellow gamers. Hit me up for game night!';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: DEFAULT_AVATAR }}
        style={styles.avatar}
        contentFit="cover"
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.title}>
        {title} · {yearsGaming} years gaming
      </Text>
      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>About</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  bioSection: {
    marginTop: 32,
    alignSelf: 'stretch',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});

export default ProfileScreen;
