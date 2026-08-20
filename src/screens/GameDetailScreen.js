import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { BOARDGAME_INDEX } from "../api/boardgames";
import ImageLightbox from "../components/ImageLightbox";
import GameImage, { gameHeroUri, gameSheetThumbs } from "../components/GameImage";

const indexById = new Map(BOARDGAME_INDEX.map((g) => [String(g.id), g]));

const enrichFromIndex = (game) => {
  if (!game) return game;
  const src = indexById.get(String(game.id));
  if (!src) return game;
  return {
    ...src,
    ...Object.fromEntries(
      Object.entries(game).filter(([, v]) => v != null && v !== ""),
    ),
    image: src.image || game.image,
    imageLarge: src.imageLarge || game.imageLarge,
    imageViews: src.imageViews || game.imageViews,
    description: game.description || src.description,
    categories: src.categories || game.categories,
    mechanics: src.mechanics || game.mechanics,
    gameTypes: src.gameTypes || game.gameTypes,
  };
};

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
  const rawGame = route.params?.game;
  const game = useMemo(() => enrichFromIndex(rawGame), [rawGame]);
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

  const { width: screenWidth } = useWindowDimensions();
  const heroHeight = Math.round(screenWidth * 0.75);
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
      <View style={[styles.heroContainer, { height: heroHeight, backgroundColor: colors.border }]}>
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
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle} numberOfLines={2}>
                {game.name}
              </Text>
              {game.rating != null && (
                <Text style={styles.heroRating}>★ {game.rating.toFixed(1)}</Text>
              )}
            </LinearGradient>
          </Pressable>
        ) : (
          <View style={styles.heroPlaceholder}>
            <Ionicons name="game-controller-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.heroPlaceholderText, { color: colors.textSecondary }]}>
              {game.name}
            </Text>
          </View>
        )}
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
          {game.rank != null && (
            <View style={styles.rankBadge}>
              <Ionicons name="trophy-outline" size={13} color="#B8860B" />
              <Text style={styles.rankText}>#{game.rank}</Text>
            </View>
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

        <View style={[styles.stats, { borderColor: colors.border }]}>
          {players && (
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Players
              </Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {players}
              </Text>
            </View>
          )}
          {playtime && (
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Play Time
              </Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {playtime}
              </Text>
            </View>
          )}
          {game.minAge != null && (
            <View style={styles.stat}>
              <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Age
              </Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {game.minAge}+
              </Text>
            </View>
          )}
        </View>

        {game.gameTypes?.length > 0 && (
          <View style={styles.chipSection}>
            <Text style={[styles.chipSectionTitle, { color: colors.textSecondary }]}>
              Type
            </Text>
            <View style={styles.chipRow}>
              {game.gameTypes.map((t) => (
                <View
                  key={t}
                  style={[styles.chip, { backgroundColor: isDark ? "#2D3748" : "#EBF5FF" }]}
                >
                  <Text style={[styles.chipText, { color: isDark ? "#90CDF4" : "#2B6CB0" }]}>
                    {t}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {game.categories?.length > 0 && (
          <View style={styles.chipSection}>
            <Text style={[styles.chipSectionTitle, { color: colors.textSecondary }]}>
              Categories
            </Text>
            <View style={styles.chipRow}>
              {game.categories.map((c) => (
                <View
                  key={c}
                  style={[styles.chip, { backgroundColor: isDark ? "#2D2B3E" : "#F3E8FF" }]}
                >
                  <Text style={[styles.chipText, { color: isDark ? "#D6BCFA" : "#6B21A8" }]}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {game.mechanics?.length > 0 && (
          <View style={styles.chipSection}>
            <Text style={[styles.chipSectionTitle, { color: colors.textSecondary }]}>
              Mechanics
            </Text>
            <View style={styles.chipRow}>
              {game.mechanics.map((m) => (
                <View
                  key={m}
                  style={[styles.chip, { backgroundColor: isDark ? "#1C3329" : "#ECFDF5" }]}
                >
                  <Text style={[styles.chipText, { color: isDark ? "#68D391" : "#065F46" }]}>
                    {m}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
    overflow: "hidden",
  },
  heroPressable: {
    width: "100%",
    height: "100%",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroRating: {
    fontSize: 15,
    fontWeight: "600",
    color: "#A5D6A7",
    marginTop: 4,
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 20,
  },
  heroPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
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
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(184,134,11,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rankText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B8860B",
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
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  chipSection: {
    marginBottom: 16,
  },
  chipSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
    marginTop: 8,
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
