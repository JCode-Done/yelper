const YELP_API_BASE = 'https://api.yelp.com/v3';

const getApiKey = () => {
  const key = process.env.EXPO_PUBLIC_YELP_API_KEY;
  if (!key) {
    console.warn(
      'Missing EXPO_PUBLIC_YELP_API_KEY. Add it to your .env file. Get a key at https://www.yelp.com/developers/v3/manage_app'
    );
    return null;
  }
  return key;
};

/**
 * Search for businesses using the Yelp Fusion API
 * @param {Object} params
 * @param {string} params.term - Search term (e.g. "restaurants", "pizza")
 * @param {string} [params.location] - Location (e.g. "San Francisco", "NYC")
 * @param {number} [params.limit] - Max results (default 20, max 50)
 * @returns {Promise<Object>} API response with businesses array
 */
export const searchBusinesses = async ({ term, location = 'San Francisco', limit = 20 }) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { businesses: [], error: 'API key not configured' };
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
