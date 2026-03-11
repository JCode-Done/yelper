import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MOCK_GAMES, searchBoardGames } from "../api/boardgames";
import CategoryIcons from "../components/CategoryIcons";
import HorizontalThumbnails from "../components/HorizontalThumbnails";
import SearchBar from "../components/SearchBar";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term) => {
    setLoading(true);
    setError(null);
    const { games, error: apiError } = await searchBoardGames({ term });
    setLoading(false);
    if (apiError) {
      setError(apiError);
      setResults([]);
    } else {
      setResults(games);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.resultItem,
        pressed && styles.resultItemPressed,
      ]}
      onPress={() => navigation.navigate("GameDetail", { game: item })}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.thumbnail}
          contentFit="cover"
        />
      ) : (
        <View style={styles.thumbnail} />
      )}
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
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearchSubmit={handleSearch} />
      <CategoryIcons />
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
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!loading && !error && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading && results.length === 0 ? (
              <Text style={styles.emptyText}>
                Search for board games to get started
              </Text>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hotnessSection: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  hotnessTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginHorizontal: 15,
    marginBottom: 8,
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
