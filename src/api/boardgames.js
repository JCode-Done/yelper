const BGG_SEARCH_URL = "https://boardgamegeek.com/xmlapi2/search";
const BGG_THING_URL = "https://boardgamegeek.com/xmlapi2/thing";

const stripHtml = (html) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const MOCK_GAMES = [
  {
    id: "13",
    name: "Catan",
    year: 1995,
    badge: "Resource Management",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/A_game_of_Settlers_of_Catan.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/A_game_of_Settlers_of_Catan.jpg",
    rating: 7.2,
    description:
      "In Catan, players try to be the dominant force on the island by building settlements, cities, and roads. Resources are gathered each turn based on dice rolls.",
    minPlayers: 3,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 90,
    minAge: 10,
    usersRated: 89200,
  },
  {
    id: "9217",
    name: "Ticket to Ride",
    year: 2004,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",   
 imageLarge: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg", rating: 7.4,
    description:
      "Ticket to Ride is a cross-country train adventure. Collect train cards to claim railway routes connecting cities across North America.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 30,
    maxPlaytime: 60,
    minAge: 8,
    usersRated: 85400,
  },
  {
    id: "222",
    name: "Carcassonne",
    year: 2000,
    image: "https://assetsio.gnwcdn.com/carcassone-layout-image-adobe-4-oliver-foerstner.png?width=690&quality=85&format=jpg&dpr=2&auto=webp",
    imageLarge: "https://assetsio.gnwcdn.com/carcassone-layout-image-adobe-4-oliver-foerstner.png?width=690&quality=85&format=jpg&dpr=2&auto=webp",
    rating: 7.4,
    description:
      "Tile-placement game where players draw and place tiles to build the medieval landscape around Carcassonne.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 30,
    maxPlaytime: 45,
    minAge: 7,
    usersRated: 72300,
  },
  {
    id: "266192",
    name: "Wingspan",
    year: 2019,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Components_in_Wingspan_board_game.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Components_in_Wingspan_board_game.jpg",
    rating: 8.1,
    description:
      "It is a medium-weight, card-driven, engine-building board game in which players compete to attract birds to their wildlife reserves. During the game's development process, Hargrave constructed personal charts of birds observed in Maryland, with statistics sourced from various biological databases; the special powers of birds were also selected to resemble real-life characteristics. It is a medium-weight, card-driven, engine-building board game in which players compete to attract birds to their wildlife reserves. During the game's development process, Hargrave constructed personal charts of birds observed in Maryland, with statistics sourced from various biological databases; the special powers of birds were also selected to resemble real-life characteristics.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 40,
    maxPlaytime: 70,
    minAge: 10,
    usersRated: 61200,
  },
  {
    id: "174430",
    name: "Gloomhaven",
    year: 2017,
 image: "https://theboardgameschronicle.com/wp-content/uploads/2021/07/40_00.jpg",   
 imageLarge: "https://theboardgameschronicle.com/wp-content/uploads/2021/07/40_00.jpg",    rating: 8.8,
    description:
      "Gloomhaven is a cooperative dungeon-crawler with branching storylines, tactical combat, and evolving character classes.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    minAge: 14,
    usersRated: 45200,
  },
  {
    name: "Azul",
    year: 2017,
 image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",   
 imageLarge: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",    rating: 7.7,
    description:
      "Azul is a tile-drafting game where players collect matching colored tiles to decorate the walls of the Royal Palace of Evora.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 45,
    minAge: 8,
    usersRated: 54800,
  },
  {
    id: "148228",
    name: "Splendor",
    year: 2014,
 image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",   
 imageLarge: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",    rating: 7.4,
    description:
      "Splendor is a game of collecting gems and buying developments. Players compete to attract nobles and build the most prestigious jewelry business.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 30,
    minAge: 10,
    usersRated: 67200,
  },
  {
    id: "30549",
    name: "Pandemic",
    year: 2008,
 image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",   
 imageLarge: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",    rating: 7.6,
    description:
      "Pandemic is a cooperative game where players work together to stop four diseases from spreading across the world. Cure all diseases before time runs out.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 45,
    maxPlaytime: 45,
    minAge: 8,
    usersRated: 89100,
  },
  {
    id: "174356",
    name: "cars",
 image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",   
 imageLarge: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",    rating: 4.8,
    description:
      "Gloomhaven is a cooperative dungeon-crawler with branching storylines, tactical combat, and evolving character classes.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    minAge: 14,
    usersRated: 45200,
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decode = (s) =>
  (s || "")
    .replace(/&amp;/g, "&")
    .replace(/&#10;/g, " ")
    .replace(/&quot;/g, '"');

/** Parse BGG XML search response into games array (id, name, year) */
const parseSearchXml = (xml) => {
  const games = [];
  const itemRegex =
    /<item[^>]*id="(\d+)"[^>]*>[\s\S]*?<name[^>]*value="([^"]+)"[^>]*>[\s\S]*?(?:<yearpublished[^>]*value="(\d+)"[^>]*>)?/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    games.push({
      id: match[1],
      name: decode(match[2]),
      year: match[3] ? parseInt(match[3], 10) : null,
      type: "boardgame",
    });
  }
  return games;
};

/** Parse BGG thing XML for full game details */
const parseThingXml = (xml) => {
  const games = [];
  const itemBlockRegex = /<item[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/item>/g;
  let blockMatch;
  while ((blockMatch = itemBlockRegex.exec(xml)) !== null) {
    const id = blockMatch[1];
    const block = blockMatch[2];
    const nameMatch = block.match(
      /<name[^>]*type="primary"[^>]*value="([^"]+)"/,
    );
    const yearMatch = block.match(/<yearpublished[^>]*value="(\d+)"/);
    const thumbMatch = block.match(/<thumbnail>([^<]+)</);
    const imageMatch = block.match(/<image>([^<]+)</);
    const fullImage = imageMatch
      ? imageMatch[1]
      : thumbMatch
        ? thumbMatch[1]
        : null;
    const thumbImage = thumbMatch
      ? thumbMatch[1]
      : imageMatch
        ? imageMatch[1]
        : null;
    const avgMatch = block.match(/<average[^>]*value="([^"]+)"/);
    const descMatch = block.match(
      /<description[^>]*>([\s\S]*?)<\/description>/,
    );
    const minPMatch = block.match(/<minplayers[^>]*value="(\d+)"/);
    const maxPMatch = block.match(/<maxplayers[^>]*value="(\d+)"/);
    const minTMatch = block.match(/<minplaytime[^>]*value="(\d+)"/);
    const maxTMatch = block.match(/<maxplaytime[^>]*value="(\d+)"/);
    const minAMatch = block.match(/<minage[^>]*value="(\d+)"/);
    const usersMatch = block.match(/<usersrated[^>]*value="(\d+)"/);
    const num = (m) => (m ? parseInt(m[1], 10) : null);
    games.push({
      id,
      name: nameMatch ? decode(nameMatch[1]) : null,
      year: yearMatch ? parseInt(yearMatch[1], 10) : null,
      image: thumbImage,
      imageLarge: fullImage,
      rating: avgMatch ? parseFloat(avgMatch[1]) : null,
      description: descMatch ? stripHtml(descMatch[1]) : null,
      minPlayers: num(minPMatch),
      maxPlayers: num(maxPMatch),
      minPlaytime: num(minTMatch),
      maxPlaytime: num(maxTMatch),
      minAge: num(minAMatch),
      usersRated: num(usersMatch),
    });
  }
  return games;
};

/** Fetch full game details (image, rating) from BGG thing endpoint */
const fetchGameDetails = async (gameIds) => {
  if (!gameIds.length) return [];
  const ids = gameIds.slice(0, 15).join(",");
  const response = await fetch(`${BGG_THING_URL}?id=${ids}&type=boardgame`);
  if (!response.ok) return [];
  const xml = await response.text();
  return parseThingXml(xml);
};

/**
 * Search for board games via BoardGameGeek API or mock data
 * Includes image and rating when available
 * @param {Object} params
 * @param {string} params.term - Search term
 * @param {number} [params.limit] - Max results (default 20)
 * @returns {Promise<Object>} { games: [], error: string|null }
 */
export { MOCK_GAMES };
export const searchBoardGames = async ({ term, limit = 20 }) => {
  const query = term.trim();
  if (!query) {
    await delay(200);
    let games = MOCK_GAMES.slice(0, limit).map((g) => ({ ...g }));
    try {
      const details = await fetchGameDetails(games.map((g) => g.id));
      const detailMap = Object.fromEntries(details.map((d) => [d.id, d]));
      games = games.map((g) => ({
        ...g,
        image: detailMap[g.id]?.image ?? g.image,
        imageLarge: detailMap[g.id]?.imageLarge ?? null,
      }));
    } catch (_) {}
    return { games, error: null };
  }

  try {
    const searchUrl = `${BGG_SEARCH_URL}?type=boardgame&query=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`Search failed: ${searchRes.status}`);

    const searchXml = await searchRes.text();
    const searchGames = parseSearchXml(searchXml).slice(0, limit);
    if (searchGames.length === 0) return { games: [], error: null };

    const details = await fetchGameDetails(searchGames.map((g) => g.id));
    const detailMap = Object.fromEntries(details.map((d) => [d.id, d]));

    const games = searchGames.map((g) => {
      const d = detailMap[g.id];
      return {
        ...g,
        image: d?.image ?? null,
        imageLarge: d?.imageLarge ?? null,
        rating: d?.rating ?? null,
        description: d?.description ?? null,
        minPlayers: d?.minPlayers ?? null,
        maxPlayers: d?.maxPlayers ?? null,
        minPlaytime: d?.minPlaytime ?? null,
        maxPlaytime: d?.maxPlaytime ?? null,
        minAge: d?.minAge ?? null,
        usersRated: d?.usersRated ?? null,
      };
    });

    return { games, error: null };
  } catch (error) {
    console.warn("BGG API failed, using mock data:", error.message);
    await delay(400);
    const q = query.toLowerCase();
    let games = MOCK_GAMES.filter(
      (g) => !query || g.name.toLowerCase().includes(q),
    )
      .slice(0, limit)
      .map((g) => ({ ...g }));

    try {
      const details = await fetchGameDetails(games.map((g) => g.id));
      const detailMap = Object.fromEntries(details.map((d) => [d.id, d]));
      games = games.map((g) => ({
        ...g,
        image: detailMap[g.id]?.image ?? g.image,
        imageLarge: detailMap[g.id]?.imageLarge ?? null,
      }));
    } catch (_) {}
    return { games, error: null };
  }
};
