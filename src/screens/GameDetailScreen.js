import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

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
          <Feather name="x" size={24} color="#1a1a1a" />
        </Pressable>
      ),
    });
  }, [game?.name, navigation]);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No game data</Text>
      </View>
    );
  }

  const playtime = formatPlaytime(game.minPlaytime, game.maxPlaytime);
  const players = formatPlayers(game.minPlayers, game.maxPlayers);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroContainer}>
        {game.imageLarge || game.image ? (
          <Image
            source={{ uri: game.imageLarge || game.image }}
            style={styles.heroImage}
            contentFit="cover"
          />
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{game.name}</Text>

        <View style={styles.metaRow}>
          {game.rating != null && (
            <Text style={styles.rating}>★ {game.rating.toFixed(1)}</Text>
          )}
          {game.year != null && <Text style={styles.meta}>{game.year}</Text>}
          {game.usersRated != null && (
            <Text style={styles.meta}>
              {game.usersRated.toLocaleString()} ratings
            </Text>
          )}
        </View>

        <View style={styles.stats}>
          {players && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Players</Text>
              <Text style={styles.statValue}>{players}</Text>
            </View>
          )}
          {playtime && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Play Time</Text>
              <Text style={styles.statValue}>{playtime}</Text>
            </View>
          )}
          {game.minAge != null && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Age</Text>
              <Text style={styles.statValue}>{game.minAge}+</Text>
            </View>
          )}
        </View>

        {game.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{game.description}</Text>
          </View>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  error: {
    padding: 20,
    color: "#6B7280",
  },
  heroContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#E5E7EB",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
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
    color: "#6B7280",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
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
