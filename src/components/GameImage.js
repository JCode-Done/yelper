import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

export const gameThumbUri = (game) =>
  (game && (game.image || game.imageLarge)) || null;

export const gameHeroUri = (game) =>
  (game && (game.imageLarge || game.image)) || null;

/** Unique cover + extra views for the game detail sheet. */
export const gameSheetThumbs = (game) => {
  if (!game) return [];
  const seen = new Set();
  const thumbs = [];
  const add = (url, caption) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    thumbs.push({ url, caption: caption || null });
  };
  add(game.image, game.name);
  add(game.imageLarge, game.name);
  if (Array.isArray(game.imageViews)) {
    for (const view of game.imageViews) {
      add(view?.url, view?.caption || game.name);
    }
  }
  return thumbs;
};

const GameImage = ({
  uri,
  fallbackUri,
  style,
  contentFit = "cover",
  ...rest
}) => {
  const candidates = useMemo(
    () => [...new Set([uri, fallbackUri].filter(Boolean))],
    [uri, fallbackUri],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [uri, fallbackUri]);

  const src = candidates[index];
  if (!src) {
    return <View style={style} />;
  }

  return (
    <View style={[styles.frame, style]}>
      <Image
        source={{ uri: src }}
        style={styles.fill}
        contentFit={contentFit}
        recyclingKey={src}
        transition={0}
        onError={() => {
          setIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
        }}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    overflow: "hidden",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});

export default GameImage;
