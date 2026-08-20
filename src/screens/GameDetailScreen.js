import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import ImageLightbox from "../components/ImageLightbox";
import GameImage, { gameHeroUri, gameSheetThumbs } from "../components/GameImage";

const formatPlaytime = (min, max) => {
  if (min == null && max == null) return null;
  if (min === max || max == null) return `${min} min`;
  return `${min}-${max} min`;
};

const formatPlayers = (min, max) => {
  if (min == null && max == null) return null;
  if (min === max || max == null) return `${min} player${min !== 1 ? "s" : ""}`;
  return `${min}-${max} players`;
};

const GameDetailScreen = ({ route, navigation }) => {
  const { game } = route.params || {};
  const { colors, isDark } = useTheme();
  const [lightbox, setLightbox] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game?.name ?? "Game Details",
      headerRight: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
          hitSlop={12}
        >
          <Feather
            name="x"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
      ),
    });
  }, [game?.name, navigation, isDark, colors]);

  if (!game) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.error,
            { color: colors.textSecondary },
          ]}
        >
          No game data
        </Text>
      </View>
    );
  }

  const playtime = formatPlaytime(game.minPlaytime, game.maxPlaytime);
  const players = formatPlayers(game.minPlayers, game.maxPlayers);
  const heroUri = gameHeroUri(game);
  const thumbs = gameSheetThumbs(game);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.heroContainer, { backgroundColor: colors.border }]}>
        {heroUri ? (
          <Pressable
            onPress={() =>
              setLightbox({
                url: heroUri,
                caption: game.name,
              })
            }
            style={styles.heroPressable}
          >
            <GameImage
              uri={game.imageLarge}
              fallbackUri={game.image}
              style={styles.heroImage}
              contentFit="cover"
            />
          </Pressable>
        ) : null}
      </View>
      {thumbs.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.viewsRow}
        >
          {thumbs.map((view, index) => (
            <Pressable
              key={view.url || `view-${index}`}
              onPress={() =>
                setLightbox({
                  url: view.url,
                  caption: view.caption || game.name,
                })
              }
              style={({ pressed }) => [
                styles.viewImageWrap,
                pressed && styles.viewImagePressed,
              ]}
            >
              <GameImage
                uri={view.url}
                style={styles.viewImage}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <View
        style={[
          styles.body,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          {game.name}
        </Text>

        <View style={styles.metaRow}>
          {game.rating != null && (
            <Text style={styles.rating}>★ {game.rating.toFixed(1)}</Text>
          )}
          {game.year != null && (
            <Text
              style={[
                styles.meta,
                { color: colors.textSecondary },
              ]}
            >
              {game.year}
            </Text>
          )}
          {game.usersRated != null && (
            <Text
              style={[
                styles.meta,
                { color: colors.textSecondary },
              ]}
            >
              {game.usersRated.toLocaleString()} ratings
            </Text>
          )}
        </View>

        {(game.players || game.types?.length) ? (
          <Text
            style={[
              styles.meta,
              { color: colors.textSecondary, marginBottom: 16 },
            ]}
          >
            {game.players ? `${game.players} players` : null}
            {game.players && game.types?.length ? " · " : null}
            {(game.mechanics?.length ? game.mechanics : game.types)
              ?.slice(0, 6)
              .join(" · ")}
          </Text>
        ) : null}

        <View style={[styles.stats, { borderColor: colors.border }]}>
          {players && (
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Players
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.textPrimary },
                ]}
              >
                {players}
              </Text>
            </View>
          )}
          {playtime && (
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Play Time
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.textPrimary },
                ]}
              >
                {playtime}
              </Text>
            </View>
          )}
          {game.minAge != null && (
            <View style={styles.stat}>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Age
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.textPrimary },
                ]}
              >
                {game.minAge}+
              </Text>
            </View>
          )}
        </View>

        {game.description && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary },
              ]}
            >
              About
            </Text>
            <Text
              style={[
                styles.description,
                { color: colors.textPrimary },
              ]}
            >
              {game.description}
            </Text>
          </View>
        )}

      </View>
    </ScrollView>
      <ImageLightbox
        visible={!!lightbox}
        url={lightbox?.url}
        caption={lightbox?.caption}
        onClose={() => setLightbox(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  error: {
    padding: 20,
  },
  heroContainer: {
    width: "100%",
    height: 240,
    overflow: "hidden",
  },
  heroPressable: {
    width: "100%",
    height: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  viewsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  viewImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
    backgroundColor: "rgba(128,128,128,0.15)",
  },
  viewImageWrap: {
    borderRadius: 8,
    overflow: "hidden",
  },
  viewImagePressed: {
    opacity: 0.8,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },
  meta: {
    fontSize: 15,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "transparent",
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    padding: 8,
    marginRight: 4,
  },
  closeButtonPressed: {
    opacity: 0.6,
  },
});

export default GameDetailScreen;
