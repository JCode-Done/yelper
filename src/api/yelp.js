const YELP_API_BASE = 'https://api.yelp.com/v3';

const MOCK_BUSINESSES = [
  { id: 'm1', name: 'Joe\'s Pizza', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Pizza' }], rating: 4.5, review_count: 892 },
  { id: 'm2', name: 'Blue Bottle Coffee', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Coffee & Tea' }], rating: 4.2, review_count: 1203 },
  { id: 'm3', name: 'The Slanted Door', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Vietnamese' }], rating: 4.0, review_count: 3421 },
  { id: 'm4', name: 'Tartine Bakery', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Bakeries' }], rating: 4.6, review_count: 2156 },
  { id: 'm5', name: 'Swan Oyster Depot', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Seafood' }], rating: 4.4, review_count: 1567 },
  { id: 'm6', name: 'House of Prime Rib', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Steakhouses' }], rating: 4.3, review_count: 2843 },
  { id: 'm7', name: 'Burma Superstar', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Burmese' }], rating: 4.1, review_count: 1892 },
  { id: 'm8', name: 'Brenda\'s French Soul Food', location: { city: 'San Francisco', state: 'CA' }, categories: [{ title: 'Soul Food' }], rating: 4.4, review_count: 923 },
];

const getApiKey = () => {
  const key = process.env.EXPO_PUBLIC_YELP_API_KEY;
  if (!key || key === 'your_yelp_api_key_here') {
    return null;
  }
  return key;
};

/** Simulates network delay */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Search for businesses using the Yelp Fusion API, or mock data when no API key
 * @param {Object} params
 * @param {string} params.term - Search term (e.g. "restaurants", "pizza")
 * @param {string} [params.location] - Location (e.g. "San Francisco", "NYC")
 * @param {number} [params.limit] - Max results (default 20, max 50)
 * @returns {Promise<Object>} API response with businesses array
 */
export const searchBusinesses = async ({ term, location = 'San Francisco', limit = 20 }) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    await delay(400);
    const query = term.trim().toLowerCase();
    const businesses = query
      ? MOCK_BUSINESSES.filter(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.categories?.[0]?.title.toLowerCase().includes(query)
        )
      : [...MOCK_BUSINESSES];
    return { businesses: businesses.slice(0, limit), error: null };
  }

  const params = new URLSearchParams({
    term: term.trim(),
    location: location.trim(),
    limit: String(limit),
  });

  try {
    const response = await fetch(`${YELP_API_BASE}/businesses/search?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Yelp API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return { businesses: data.businesses || [], error: null };
  } catch (error) {
    console.error('Yelp search error:', error);
    return {
      businesses: [],
      error: error.message || 'Search failed',
    };
  }
};
