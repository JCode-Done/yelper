import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useCallback, useEffect } from "react";
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
import {
  MOCK_GAMES,
  BOARDGAME_INDEX,
  searchBoardGames,
  fetchBggHotList,
} from "../api/boardgames";
import FeaturedHorizontalScroll from "../components/FeaturedHorizontalScroll";
import HorizontalThumbnails from "../components/HorizontalThumbnails";
import GameImage, { gameThumbUri } from "../components/GameImage";
import SearchBar from "../components/SearchBar";
import AddCustomFilter from "../components/AddCustomFilter";
import ThemeToggle from "../components/ThemeToggle";
import { useFavorites } from "../context/FavoritesContext";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";

const DEBOUNCE_MS = 350;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isDark, colors } = useTheme();
  const thumbnailSize = Math.min(140, Math.round(width * 0.28));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [customFilters, setCustomFilters] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const debounceRef = useRef(null);
  const { avatar, username: profileName } = useProfile();
  const [hotGames, setHotGames] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchBggHotList().then(({ games }) => {
      if (!cancelled && games.length > 0) setHotGames(games);
    });
    return () => { cancelled = true; };
  }, []);


  const runSearch = useCallback(
    async (term, additive = false, tag = null, filtersOverride) => {
      setLoading(true);
      setError(null);
      const filters =
        filtersOverride !== undefined ? filtersOverride : customFilters;
      const { games, error: apiError } = await searchBoardGames(
        tag ? { tag, filters } : { term, filters },
      );
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
    },
    [customFilters],
  );

  const handleSearchChange = useCallback(
    (term) => {
      setSearchInput(term);
      setActiveTag(null);
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
      setActiveTag(null);
      runSearch(trimmed, true);
    },
    [runSearch]
  );

  const handleCustomFilterApply = useCallback(
    (nextFilters) => {
      setCustomFilters(nextFilters);
      const trimmed = searchInput.trim();
      if (!trimmed && !nextFilters && !activeTag) {
        setResults([]);
        setError(null);
        return;
      }
      runSearch(trimmed, false, activeTag, nextFilters);
    },
    [runSearch, searchInput, activeTag],
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
            <GameImage
              uri={gameThumbUri(item)}
              fallbackUri={item.imageLarge}
              style={styles.thumbnail}
              contentFit="cover"
            />
          </View>
          <View style={styles.resultContent}>
            <Text style={[styles.resultName, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.resultMeta, { color: colors.textSecondary }]}>
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.iconContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="chess-knight"
              size={28}
              color="#fff"
            />
          </View>
          <Text
            style={[
              styles.iconLabel,
              { color: colors.textPrimary },
            ]}
          >
            Game • Tap
          </Text>
        </View>
        <Pressable
          style={styles.headerRight}
          onPress={() => navigation.navigate("Profile")}
        >
          {avatar ? (
            <GameImage
              uri={avatar}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.headerAvatar]} />
          )}
          <Text
            style={[
              styles.profileName,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {profileName}
          </Text>
        </Pressable>
      </View>
      <ThemeToggle />
      <SearchBar
        value={searchInput}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        isDark={isDark}
        onFilterPress={() => setFilterModalVisible(true)}
        onCategoryPress={(cat) => {
          if (cat.id === 'euro' || cat.id === 'strategy') {
            setSearchInput(cat.label);
            setActiveTag(cat.id);
            runSearch('', false, cat.id);
          } else {
            handleSearchChange(cat.label);
          }
        }}
      />
      <AddCustomFilter
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleCustomFilterApply}
        initialFilters={customFilters}
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
              <ActivityIndicator size="large" color={colors.textPrimary} />
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
              items={BOARDGAME_INDEX.slice(0, 12)}
              title="Featured Games"
              onItemPress={(game) => navigation.navigate("GameDetail", { game })}
            />
            <View style={styles.hotnessSection}>
              <Text
                style={[
                  styles.hotnessTitle,
                  { color: colors.textPrimary },
                ]}
              >
                BGG Hotness
              </Text>
              <HorizontalThumbnails
                thumbnailSize={thumbnailSize}
                items={(hotGames.length > 0 ? hotGames : BOARDGAME_INDEX)
                  .filter((g) => g.id && gameThumbUri(g))
                  .slice(0, 50)
                  .map((g) => ({
                    id: g.id,
                    image: gameThumbUri(g),
                    imageLarge: g.imageLarge,
                    label: g.name,
                  }))}
                onThumbnailPress={(item) => {
                  const game =
                    hotGames.find((g) => g.id === item.id) ||
                    BOARDGAME_INDEX.find((m) => m.id === item.id) ||
                    MOCK_GAMES.find((m) => m.id === item.id);
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
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
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
    backgroundColor: "rgba(128,128,128,0.2)",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    maxWidth: 120,
  },
  iconLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2E7D32",
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
    marginHorizontal: 15,
    marginBottom: 4,
  },
  loading: {
    padding: 40,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
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
    opacity: 0.7,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "rgba(128,128,128,0.15)",
  },
  resultContent: {
    flex: 1,
    marginLeft: 14,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "600",
  },
  resultMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
});

export default HomeScreen;
