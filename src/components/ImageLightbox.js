import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameImage from './GameImage';

const ImageLightbox = ({ visible, url, caption, onClose }) => {
  const { width, height } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close image"
          >
            <Feather name="x" size={28} color="#fff" />
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
          {url ? (
            <GameImage
              uri={url}
              style={{ width: width - 24, height: height * 0.72 }}
              contentFit="contain"
            />
          ) : null}
          {caption ? (
            <Text style={styles.caption} numberOfLines={4}>
              {caption}
            </Text>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 64,
    right: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  closeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
});

export default ImageLightbox;
