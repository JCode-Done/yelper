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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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
  avatarUri,
  onAvatarChange,
  title: modalTitle = 'Edit Profile',
}) => {
  const { height } = useWindowDimensions();
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setTitle(initialTitle);
    }
  }, [visible, initialName, initialTitle]);

  const handleSave = () => {
    onSave?.({ name, title });
    onCancel?.();
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      onAvatarChange?.(result.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      onAvatarChange?.(result.assets[0].uri);
    }
  };

  const sheetHeight = Math.round(height * 0.55);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable
          style={[styles.modalSheet, { height: sheetHeight }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Pressable onPress={onCancel} style={styles.closeButton} hitSlop={12}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
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
                style={({ pressed }) => [styles.photoButton, pressed && styles.photoButtonPressed]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color="#2E7D32" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.photoButton, pressed && styles.photoButtonPressed]}
                onPress={uploadPhoto}
              >
                <Ionicons name="image" size={24} color="#2E7D32" />
                <Text style={styles.photoButtonText}>Upload Photo</Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Board Game Enthusiast"
              placeholderTextColor="#9CA3AF"
            />

            <Pressable
              style={({ pressed }) => [styles.updateButton, pressed && styles.updateButtonPressed]}
              onPress={handleSave}
            >
              <Text style={styles.updateButtonText}>Update</Text>
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
    backgroundColor: '#fff',
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
    color: '#1a1a1a',
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
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  photoButtonPressed: {
    opacity: 0.8,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonPressed: {
    opacity: 0.9,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileEditModal;
