import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Horizontal scrollable thumbnail component
 * @param {Object} props
 * @param {Array} props.items - Array of { id, image (uri), label? }
 * @param {Function} [props.onThumbnailPress] - Called with (item) when thumbnail is pressed
 * @param {number} [props.thumbnailSize] - Size of each thumbnail (default 160)
 * @param {number} [props.thumbnailGap] - Gap between thumbnails (default 12)
 */
const HorizontalThumbnails = ({
  items = [],
  onThumbnailPress,
  thumbnailSize = 140,
  thumbnailGap = 12,
}) => {
  if (!items.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => onThumbnailPress?.(item)}
          style={({ pressed }) => [
            styles.thumbnailWrapper,
            { marginRight: index < items.length - 1 ? thumbnailGap : 0 },
            pressed && styles.thumbnailPressed,
          ]}
          disabled={!onThumbnailPress}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={[
                styles.thumbnail,
                { width: thumbnailSize, height: thumbnailSize },
              ]}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.thumbnailPlaceholder,
                { width: thumbnailSize, height: thumbnailSize },
              ]}
            />
          )}
          {item.label != null && (
            <Text style={styles.label} numberOfLines={2}>
              {item.label}
            </Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  thumbnailWrapper: {
    alignItems: "center",
  },
  thumbnail: {
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    borderRadius: 8,
    backgroundColor: "#676767",
  },
  thumbnailPressed: {
    opacity: 0.8,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 160,
  },
});

export default HorizontalThumbnails;
