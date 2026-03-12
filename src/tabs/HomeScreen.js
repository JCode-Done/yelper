import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeaturedHorizontalScroll from '../components/FeaturedHorizontalScroll';
import { MOCK_GAMES } from '../api/boardgames';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FeaturedHorizontalScroll
        items={MOCK_GAMES}
        title="Featured Games"
        onItemPress={(game) => navigation.navigate('GameDetail', { game })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 15,
    marginBottom: 8,
  },
});

export default HomeScreen;
