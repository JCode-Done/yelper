import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VideoFlatList, { MOCK_VIDEOS, MOCK_PODCASTS } from '../components/VideoFlatList';
import { useTheme } from '../context/ThemeContext';

const VideosScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleVideoPress = (item) =>
    navigation.navigate('VideoPlayer', {
      source: { type: 'youtube', videoId: item.videoId },
      title: item.title,
      subtitle: item.channel,
      mode: 'video',
    });

  const handlePodcastPress = (item) =>
    navigation.navigate('VideoPlayer', {
      source: { type: 'youtube', videoId: item.videoId },
      title: item.title,
      subtitle: item.channel,
      mode: 'audio',
    });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.textPrimary },
        ]}
      >
        Videos
      </Text>
      <VideoFlatList videos={MOCK_VIDEOS} onVideoPress={handleVideoPress} scrollEnabled={false} />
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.textPrimary },
        ]}
      >
        Board Gaming Podcasts
      </Text>
      <VideoFlatList videos={MOCK_PODCASTS} onVideoPress={handlePodcastPress} scrollEnabled={false} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 8,
  },
});

export default VideosScreen;
