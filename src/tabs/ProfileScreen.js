import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import ProfileEditModal from '../components/ProfileEditModal';
import GamerProfileChart from '../components/GamerProfileChart';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = () => {
  const { avatar, name, setAvatar, setName } = useProfile();
  const [title, setTitle] = useState('Board Game Enthusiast');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { colors } = useTheme();

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
  const bio =
    "I've been collecting and playing board games since college. Favorites include Wingspan, Terraforming Mars, and Catan. Always looking to discover new titles and connect with fellow gamers. Hit me up for game night!";

  const openEditModal = () => setEditModalVisible(true);
  const cancelEditModal = () => setEditModalVisible(false);

  const handleSave = ({ name: newName, title: newTitle }) => {
    setName(newName);
    setTitle(newTitle);
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
          {name}
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
              { color: colors.textPrimary },
            ]}
          >
            {bio}
          </Text>
        </View>

        <View style={styles.chartSection}>
          <GamerProfileChart data={gamerProfileData} title="Your Gaming Profile" />
        </View>
      </ScrollView>

      <ProfileEditModal
        visible={editModalVisible}
        onCancel={cancelEditModal}
        onSave={handleSave}
        initialName={name}
        initialTitle={title}
        avatarUri={avatar}
        onAvatarChange={setAvatar}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  chartSection: {
    marginTop: 32,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
});

export default ProfileScreen;
