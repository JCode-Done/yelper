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
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MOCK_GAMES, searchBoardGames } from "../api/boardgames";
import FeaturedHorizontalScroll from "../components/FeaturedHorizontalScroll";
import HorizontalThumbnails from "../components/HorizontalThumbnails";
import SearchBar from "../components/SearchBar";
import { useFavorites } from "../context/FavoritesContext";
import { useProfile } from "../context/ProfileContext";

const DEBOUNCE_MS = 350;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { toggleFavorite, isFavorite } = useFavorites();
  const thumbnailSize = Math.min(140, Math.round(width * 0.28));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef(null);
  const { avatar, name: profileName } = useProfile();

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
      setSearchInput(term);
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
      <View style={styles.iconContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="chess-knight"
              size={28}
              color="#fff"
            />
          </View>
          <Text style={styles.iconLabel}>Game • Tap</Text>
        </View>
        <Pressable
          style={styles.headerRight}
          onPress={() => navigation.navigate("Profile")}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.headerAvatar]} />
          )}
          <Text style={styles.profileName} numberOfLines={1}>
            {profileName}
          </Text>
        </Pressable>
      </View>
      <SearchBar
        value={searchInput}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onCategoryPress={(cat) => handleSearchChange(cat.label)}
      />
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item, index) => item.id ?? item.name ?? `item-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <>
            <FeaturedHorizontalScroll
              items={MOCK_GAMES}
              title="Featured Games"
              onItemPress={(game) => navigation.navigate("GameDetail", { game })}
            />
            <View style={styles.hotnessSection}>
              <Text style={styles.hotnessTitle}>Hotness</Text>
              <HorizontalThumbnails
                thumbnailSize={thumbnailSize}
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
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 0,
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "right",
    maxWidth: 120,
  },
  iconLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
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
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
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
});

export default HomeScreen;
