import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MediaPlayer from '../components/MediaPlayer';

const VideoPlayerScreen = ({ route, navigation }) => {
  const { videoId, title, subtitle, source, mode } = route?.params ?? {};

  useLayoutEffect(() => {
    if (title && navigation?.setOptions) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  // Accept either { source, title, subtitle, mode } or legacy { videoId, title }
  const mediaSource = source ?? (videoId ? { type: 'youtube', videoId } : null);

  if (!mediaSource) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No video selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MediaPlayer
        source={mediaSource}
        mode={mode ?? 'video'}
        title={title}
        subtitle={subtitle}
        autoPlay
        style={styles.player}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  error: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default VideoPlayerScreen;
