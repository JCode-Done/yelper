import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Horizontal scrollable thumbnail component
 * @param {Object} props
 * @param {Array} props.items - Array of { id, image (uri), label? }
 * @param {Function} [props.onThumbnailPress] - Called with (item) when thumbnail is pressed
 * @param {number} [props.thumbnailSize] - Size of each thumbnail (default 140)
 * @param {number} [props.thumbnailGap] - Gap between thumbnails (default 12)
 * @param {string} [props.fadeColor] - Color for right-edge fade (default "#fff")
 */
const HorizontalThumbnails = ({
  items = [],
  onThumbnailPress,
  thumbnailSize = 140,
  thumbnailGap = 12,
}) => {
  if (!items.length) return null;

  return (
    <View style={styles.wrapper}>
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
            <Text
              style={[styles.label, { maxWidth: thumbnailSize }]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 15,
  },
  thumbnailWrapper: {
    alignItems: "center",
  },
  thumbnail: {
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnailPlaceholder: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  thumbnailPressed: {
    opacity: 0.8,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default HorizontalThumbnails;
