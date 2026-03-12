import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VideoFlatList, { MOCK_VIDEOS, MOCK_PODCASTS } from '../components/VideoFlatList';

const VideosScreen = () => {
  const navigation = useNavigation();
  const handleVideoPress = (item) =>
    navigation.navigate('VideoPlayer', { videoId: item.videoId, title: item.title });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Videos</Text>
      <VideoFlatList videos={MOCK_VIDEOS} onVideoPress={handleVideoPress} scrollEnabled={false} />
      <Text style={styles.sectionTitle}>Board Gaming Podcasts</Text>
      <VideoFlatList videos={MOCK_PODCASTS} onVideoPress={handleVideoPress} scrollEnabled={false} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 8,
  },
});

export default VideosScreen;
