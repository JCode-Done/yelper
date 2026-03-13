import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const MOCK_VIDEOS = [
  { id: '1', videoId: '31nyuvC-6p0', title: 'Top 10 Games of 2024', channel: 'Dice Tower' },
  { id: '2', videoId: 'Ez2xEYdu9b8', title: 'Meeples & Monsters Review', channel: 'Dice Tower' },
  { id: '3', videoId: 'xYtsL9znkpI', title: 'Catan Rules - How to Play', channel: 'Gaming Rules!' },
  { id: '4', videoId: 'PK8Iij-tqXc', title: 'Wingspan Full Rules Tutorial', channel: 'Gaming Rules!' },
  { id: '5', videoId: 'KhdFwE3SlIc', title: 'Heavy Euro Weekly Roundup', channel: 'Man vs Meeple' },
  { id: '6', videoId: 'r_Bg4_3PLNk', title: 'New Releases Overview', channel: 'Man vs Meeple' },
  { id: '7', videoId: 'OU6b0dG0l_E', title: 'Kickstarter Unboxing', channel: 'BoardGameCo' },
  { id: '8', videoId: 'dPvDNGQzA8M', title: 'Board Game Haul', channel: 'BoardGameCo' },
  { id: '9', videoId: 'f7Gf4E1hL9Y', title: 'Quick Play: Wingspan', channel: 'Tabletop Turtle' },
  { id: '10', videoId: '9pLkI6V-5k8', title: 'Gateway Games Explained', channel: 'Tabletop Turtle' },
  { id: '11', videoId: 'Lq1R64EN2_4', title: 'Worker Placement Mechanics', channel: 'Meeple University' },
  { id: '12', videoId: '3fL5aTdDd7w', title: 'Drafting in Board Games', channel: 'Meeple University' },
  { id: '13', videoId: 'z2Vp6lJEurg', title: 'Best Abstract Strategy Games', channel: 'No Pun Included' },
  { id: '14', videoId: 'g9H9L0k9J0k', title: 'Designer Spotlight', channel: 'No Pun Included' },
];

const MOCK_PODCASTS = [
  { id: 'p1', videoId: '5L6Bjs8Yz9E', title: 'Best Board Games of 2024', channel: 'The Dice Tower Podcast' },
  { id: 'p2', videoId: 'dQw4w9WgXcQ', title: 'Kickstarter: What to Back', channel: 'Board Game Barrage' },
  { id: 'p3', videoId: '9bZkp7q19f0', title: 'Heavy Euros Deep Dive', channel: 'So Very Wrong About Games' },
  { id: 'p4', videoId: 'kJQP7kiw5Fk', title: 'Designer Interview: Elizabeth Hargrave', channel: 'The Long View' },
  { id: 'p5', videoId: 'RgKAFK5djSk', title: 'Gateway Games for New Gamers', channel: 'Blue Peg, Pink Peg' },
  { id: 'p6', videoId: 'OPf0YbXqDm0', title: 'Top 10 Solo Board Games', channel: 'The Secret Cabal' },
  { id: 'p7', videoId: '09R8_2nJtjg', title: 'New Releases Roundup', channel: 'Shut Up & Sit Down' },
  { id: 'p8', videoId: 'fJ9rUzIMcZQ', title: 'Abstract Strategy Games', channel: 'No Pun Included' },
];

const getThumbnailUrl = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const defaultOpenVideo = (videoId) => {
  Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`).catch(() => {});
};

const VideoFlatList = ({ videos = MOCK_VIDEOS, onVideoPress, scrollEnabled = true }) => {
  const { colors } = useTheme();
  const handlePress = (item) => {
    if (onVideoPress) {
      onVideoPress(item);
    } else {
      defaultOpenVideo(item.videoId);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: colors.card,
        },
        pressed && styles.itemPressed,
      ]}
      onPress={() => handlePress(item)}
    >
      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: getThumbnailUrl(item.videoId) }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.95)" />
        </View>
      </View>
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.channel,
            { color: colors.textSecondary },
          ]}
        >
          {item.channel}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 15,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  itemPressed: {
    opacity: 0.9,
  },
  thumbnailWrapper: {
    width: 160,
    height: 90,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  thumbnail: {
    width: 160,
    height: 90,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  channel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default VideoFlatList;
export { MOCK_VIDEOS, MOCK_PODCASTS };
