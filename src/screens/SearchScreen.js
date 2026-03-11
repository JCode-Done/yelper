import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import { searchBusinesses } from '../api/yelp';

const SearchScreen = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term) => {
    setLoading(true);
    setError(null);
    const { businesses, error: apiError } = await searchBusinesses({ term });
    setLoading(false);
    if (apiError) {
      setError(apiError);
      setResults([]);
    } else {
      setResults(businesses);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.resultDetails}>
        {item.location?.city}, {item.location?.state} · {item.categories?.[0]?.title || 'Business'}
      </Text>
      {item.rating != null && (
        <Text style={styles.resultRating}>★ {item.rating} ({item.review_count} reviews)</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onSearchSubmit={handleSearch} />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#D32323" />
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
                Search for restaurants, bars, and more to get started
              </Text>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FEE2E2',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  listContent: {
    padding: 15,
    paddingTop: 10,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resultDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  resultRating: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default SearchScreen;
