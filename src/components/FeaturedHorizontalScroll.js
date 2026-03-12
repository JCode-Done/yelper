import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
const CARD_ASPECT = 3 / 2;
const CARD_MAX_WIDTH = 300;
const HORIZONTAL_PADDING = 30;

/**
 * Featured horizontal scroll component for home page
 * @param {Object} props
 * @param {Array} props.items - Array of { id, name, image, year?, rating? }
 * @param {Function} [props.onItemPress] - Called with (item) when item is pressed
 * @param {string} [props.title] - Section title (default "Featured")
 */
const FeaturedHorizontalScroll = ({
  items = [],
  onItemPress,
  title = 'Featured',
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(CARD_MAX_WIDTH, screenWidth - HORIZONTAL_PADDING);
  const cardHeight = cardWidth / CARD_ASPECT;
  const imageHeight = Math.round(cardHeight * 0.7);

  if (!items.length) return null;

  const filteredItems = items.filter((g) => g.id && (g.image || g.imageLarge));

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {filteredItems.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => onItemPress?.(item)}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth, height: cardHeight, marginRight: index < filteredItems.length - 1 ? 16 : 0 },
              pressed && styles.cardPressed,
            ]}
            disabled={!onItemPress}
          >
            <View style={[styles.imageWrapper, { width: cardWidth, height: imageHeight }]}>
              <Image
                source={{ uri: item.image || item.imageLarge }}
                style={[styles.image, { width: cardWidth, height: imageHeight }]}
                contentFit="cover"
              />
            </View>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              {(item.year != null || item.rating != null) && (
                <Text style={styles.itemMeta}>
                  {item.rating != null && `★ ${item.rating.toFixed(1)}`}
                  {item.rating != null && item.year != null && ' · '}
                  {item.year != null && item.year}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginHorizontal: 15,
    marginBottom: 12,
  },
  container: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.9,
  },
  imageWrapper: {
    backgroundColor: '#E5E7EB',
  },
  image: {
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 4,
    marginTop: 4
  },
  itemMeta: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },
});

export default FeaturedHorizontalScroll;
