import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { colors } = useTheme();

  const renderItem = ({ item }) => {
    const key = item.id ?? item.name;
    const favorited = isFavorite(key);
    return (
      <View
        style={[
          styles.resultItem,
          { borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.resultRow,
            pressed && styles.resultItemPressed,
          ]}
          onPress={() => navigation.navigate('GameDetail', { game: item })}
        >
          <View style={styles.thumbnailWrapper}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            ) : (
              <View style={styles.thumbnail} />
            )}
            <Pressable
              style={styles.heartButton}
              onPress={() => toggleFavorite(item)}
              hitSlop={8}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={20}
                color={favorited ? '#DC2626' : '#9CA3AF'}
              />
            </Pressable>
          </View>
          <View style={styles.resultContent}>
            <Text
              style={[
                styles.resultName,
                { color: colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.resultMeta,
                { color: colors.textSecondary },
              ]}
            >
              {item.rating != null && (
                <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
              )}
              {item.rating != null && item.year != null && ' · '}
              {item.year != null && item.year}
            </Text>
          </View>
      </Pressable>
    </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.textPrimary },
        ]}
      >
        Favorites
      </Text>
      {favorites.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary },
          ]}
        >
          Tap the heart on any game to add it here
        </Text>
      ) : (
        <FlatList
          style={styles.list}
          data={favorites}
          keyExtractor={(item, index) => item.id ?? item.name ?? `fav-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
    flexGrow: 1,
  },
  resultRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  resultItemPressed: {
    backgroundColor: '#F3F4F6',
  },
  thumbnailWrapper: {
    width: 60,
    height: 50,
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  heartButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
  },
  resultContent: {
    flex: 1,
    marginLeft: 14,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resultMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  ratingText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default FavoritesScreen;
