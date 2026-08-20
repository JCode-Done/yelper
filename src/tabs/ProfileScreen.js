import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from '../components/ProfileEditModal';
import GamerProfileChart from '../components/GamerProfileChart';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { avatar, username, setAvatar, email, title, bio, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { colors } = useTheme();

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: username || 'Profile' });
  }, [navigation, username]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.textSecondary} />
      </View>
    );
  }

  const yearsGaming = 8;
  const gamerProfileData = {
    strategy: 82,
    abstract: 45,
    workerPlacement: 88,
    trickTaking: 58,
    resourceManagement: 92,
    cardGames: 68,
    areaControl: 75,
    euro: 90,
    campaign: 52,
    ameritrash: 48,
  };

  const openEditModal = () => setEditModalVisible(true);
  const cancelEditModal = () => setEditModalVisible(false);

  const handleSave = async ({ name: newUsername, title: newTitle, bio: newBio }) => {
    await updateProfile({ username: newUsername, title: newTitle, bio: newBio });
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Pressable
            style={styles.editPhotoButton}
            onPress={openEditModal}
            hitSlop={12}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
          </Pressable>
        </View>
        <Text
          style={[
            styles.name,
            { color: colors.textPrimary },
          ]}
        >
          {username}
        </Text>
        <Text
          style={[
            styles.title,
            { color: colors.textSecondary },
          ]}
        >
          {title} · {yearsGaming} years gaming
        </Text>
        <View style={styles.bioSection}>
          <Text
            style={[
              styles.bioLabel,
              { color: colors.textSecondary },
            ]}
          >
            About
          </Text>
          <Text
            style={[
              styles.bio,
              { color: bio ? colors.textPrimary : colors.textSecondary },
            ]}
          >
            {bio || 'Tap the edit button to add an about section.'}
          </Text>
        </View>

        <View style={styles.emailSection}>
          {username ? (
            <>
              <Text style={[styles.bioLabel, { color: colors.textSecondary }]}>
                Username
              </Text>
              <Text style={[styles.emailText, { color: colors.textPrimary }]}>
                {username}
              </Text>
            </>
          ) : null}
          {email ? (
            <>
              <Text style={[styles.bioLabel, { color: colors.textSecondary, marginTop: 12 }]}>
                Email
              </Text>
              <Text style={[styles.emailText, { color: colors.textPrimary }]}>
                {email}
              </Text>
            </>
          ) : null}
        </View>

        <View style={styles.chartSection}>
          <GamerProfileChart data={gamerProfileData} title="Your Gaming Profile" />
        </View>

        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutPressed]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#B91C1C" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      <ProfileEditModal
        visible={editModalVisible}
        onCancel={cancelEditModal}
        onSave={handleSave}
        initialName={username}
        initialTitle={title}
        initialBio={bio}
        avatarUri={avatar}
        onAvatarChange={setAvatar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  bioSection: {
    marginTop: 32,
    alignSelf: 'stretch',
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
  emailSection: {
    marginTop: 16,
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  emailText: {
    fontSize: 16,
    lineHeight: 24,
  },
  chartSection: {
    marginTop: 32,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B91C1C',
  },
  signOutPressed: {
    opacity: 0.7,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    marginLeft: 8,
  },
});

export default ProfileScreen;
