import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  useWindowDimensions,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Reusable profile edit modal (form sheet).
 * Props: visible, onCancel, onSave, initialName, initialTitle, avatarUri, onAvatarChange
 */
const ProfileEditModal = ({
  visible,
  onCancel,
  onSave,
  initialName = '',
  initialTitle = '',
  initialBio = '',
  avatarUri,
  onAvatarChange,
  title: modalTitle = 'Edit Profile',
}) => {
  const { height } = useWindowDimensions();
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setTitle(initialTitle);
      setBio(initialBio);
      setSaving(false);
    }
  }, [visible, initialName, initialTitle, initialBio]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({ name, title, bio });
      onCancel?.();
    } catch (err) {
      setSaving(false);
      Alert.alert('Save failed', err?.message || 'Could not save your profile. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera access required',
          'Please enable camera permissions in Settings to take a photo.',
          [{ text: 'OK' }]
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]) {
        onAvatarChange?.(result.assets[0].uri);
      }
    } catch (_err) {
      Alert.alert('Error', 'Could not open camera. Please try again.');
    }
  };

  const uploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo access required',
          'Please enable photo library permissions in Settings to choose a photo.',
          [{ text: 'OK' }]
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]) {
        onAvatarChange?.(result.assets[0].uri);
      }
    } catch (_err) {
      Alert.alert('Error', 'Could not open photo library. Please try again.');
    }
  };

  const sheetHeight = Math.round(height * 0.7);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable
          style={[
            styles.modalSheet,
            { height: sheetHeight, backgroundColor: colors.card },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: colors.textPrimary },
              ]}
            >
              {modalTitle}
            </Text>
            <Pressable onPress={onCancel} style={styles.closeButton} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.photoButtons}>
              <Pressable
                style={({ pressed }) => [styles.photoButton, styles.takePhotoButton, pressed && styles.photoButtonPressed]}
                onPress={takePhoto}
              >
                <Ionicons
                  name="camera"
                  size={24}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.photoButtonText,
                    styles.takePhotoButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Take Photo
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.photoButton, styles.uploadPhotoButton, pressed && styles.photoButtonPressed]}
                onPress={uploadPhoto}
              >
                <Ionicons
                  name="image"
                  size={24}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.photoButtonText,
                    styles.uploadPhotoButtonText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Upload Photo
                </Text>
              </Pressable>
            </View>

            <Text
              style={[
                styles.inputLabel,
                { color: colors.textSecondary },
              ]}
            >
              Username
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your username"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text
              style={[
                styles.inputLabel,
                { color: colors.textSecondary },
              ]}
            >
              Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Board Game Enthusiast"
              placeholderTextColor={colors.textSecondary}
            />

            <Text
              style={[
                styles.inputLabel,
                { color: colors.textSecondary },
              ]}
            >
              About
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={({ pressed }) => [
                styles.updateButton,
                pressed && styles.updateButtonPressed,
                saving && styles.updateButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>Update</Text>
              )}
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  takePhotoButton: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  takePhotoButtonText: {
  },
  uploadPhotoButton: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  uploadPhotoButtonText: {
  },
  photoButtonPressed: {
    opacity: 0.8,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  updateButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonPressed: {
    opacity: 0.9,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileEditModal;
