import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_GAMES, searchBoardGames } from "../api/boardgames";
import HorizontalThumbnails from "../components/HorizontalThumbnails";
import SearchBar from "../components/SearchBar";
import { useFavorites } from "../context/FavoritesContext";

const DEBOUNCE_MS = 350;

const SearchScreen = () => {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const runSearch = useCallback(async (term, additive = false) => {
    setLoading(true);
    setError(null);
    const { games, error: apiError } = await searchBoardGames({ term });
    setLoading(false);
    if (apiError) {
      setError(apiError);
    } else if (additive) {
      setResults((prev) => {
        const existingIds = new Set(games.map((g) => g.id));
        const pastOnly = prev.filter((r) => !existingIds.has(r.id));
        return [...games, ...pastOnly];
      });
    } else {
      setResults(games);
    }
  }, []);

  const handleSearchChange = useCallback(
    (term) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = term.trim();
      if (!trimmed) {
        setResults([]);
        setError(null);
        return;
      }
      debounceRef.current = setTimeout(() => {
        runSearch(trimmed, false);
      }, DEBOUNCE_MS);
    },
    [runSearch]
  );

  const handleSearchSubmit = useCallback(
    (term) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = term.trim();
      if (!trimmed) return;
      runSearch(trimmed, true);
    },
    [runSearch]
  );

  const renderItem = ({ item }) => {
    const key = item.id ?? item.name;
    const favorited = isFavorite(key);
    return (
      <View style={styles.resultItem}>
        <Pressable
          style={({ pressed }) => [
            styles.resultRow,
            pressed && styles.resultItemPressed,
          ]}
          onPress={() => navigation.navigate("GameDetail", { game: item })}
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
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.resultName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.resultMeta}>
              {item.rating != null && (
                <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
              )}
              {item.rating != null && item.year != null && " · "}
              {item.year != null && item.year}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.heartButton}
          onPress={() => toggleFavorite(item)}
          hitSlop={8}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={20}
            color={favorited ? "#DC2626" : "#9CA3AF"}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>Search board games</Text>
      <SearchBar
        onSearchSubmit={handleSearchSubmit}
        onSearchChange={handleSearchChange}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id ?? item.name ?? String(Math.random())}
        renderItem={renderItem}
        ListHeaderComponent={
          loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#2E7D32" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !error && results.length === 0 ? (
            <Text style={styles.emptyText}>
              Search for board games to get started
            </Text>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.hotnessSection}>
            <Text style={styles.hotnessTitle}>Hotness</Text>
            <HorizontalThumbnails
          items={MOCK_GAMES.filter(
            (g) => g.id && (g.image || g.imageLarge),
          ).map((g) => ({
            id: g.id,
            image: g.image || g.imageLarge,
            label: g.name,
          }))}
          onThumbnailPress={(item) => {
            const game = MOCK_GAMES.find((m) => m.id === item.id);
            if (game) navigation.navigate("GameDetail", { game });
          }}
        />
      </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    alignSelf: "stretch",
    marginTop: 12,
    marginBottom: 8,
  },
  hotnessSection: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  hotnessTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginHorizontal: 15,
    marginBottom: 4,
  },
  loading: {
    padding: 40,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#FEE2E2",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "#B91C1C",
    textAlign: "center",
  },
  listContent: {
    padding: 15,
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
    position: "relative",
  },
  resultRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    position: "relative",
  },
  heartButton: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  resultItemPressed: {
    backgroundColor: "#F3F4F6",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  resultContent: {
    flex: 1,
    marginLeft: 14,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  resultMeta: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  ratingText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
  },
});

export default SearchScreen;
