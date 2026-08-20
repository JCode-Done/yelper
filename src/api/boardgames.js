import boardgameIndexData from "../data/boardgameIndex.json";

const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";
const BGG_SEARCH_URL = `${BGG_BASE_URL}/search`;
const BGG_THING_URL = `${BGG_BASE_URL}/thing`;
const BGG_HOT_URL = `${BGG_BASE_URL}/hot`;

const stripHtml = (html) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const MOCK_GAMES = [
  {
    id: "13",
    name: "Catan",
    tags: ["strategy"],
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
    tags: ["euro"],
    year: 2004,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ticket_to_Ride_Ghost_Train_-_IMG_20260201_180542.jpg",
    rating: 7.4,
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
    tags: ["euro"],
    year: 2000,
    image:
      "https://assetsio.gnwcdn.com/carcassone-layout-image-adobe-4-oliver-foerstner.png?width=690&quality=85&format=jpg&dpr=2&auto=webp",
    imageLarge:
      "https://assetsio.gnwcdn.com/carcassone-layout-image-adobe-4-oliver-foerstner.png?width=690&quality=85&format=jpg&dpr=2&auto=webp",
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
    tags: ["euro", "strategy"],
    year: 2019,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Components_in_Wingspan_board_game.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Components_in_Wingspan_board_game.jpg",
    rating: 8.1,
    description:
      "Wingspan is a card-driven, engine-building board game where players compete to attract birds to their wildlife reserves. Collect food, lay eggs, and draw bird cards to build a thriving habitat.",
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
    tags: ["resource management"],
    year: 2017,
    image:
      "https://theboardgameschronicle.com/wp-content/uploads/2021/07/40_00.jpg",
    imageLarge:
      "https://theboardgameschronicle.com/wp-content/uploads/2021/07/40_00.jpg",
    rating: 8.8,
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
    id: "azul",
    name: "Azul",
    tags: ["abstract"],
    year: 2017,
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/c0/Azul_board_game_cover.png",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/en/c/c0/Azul_board_game_cover.png",
    rating: 7.7,
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
    tags: ["strategy"],
    year: 2014,
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Splendor_board_game_cover.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Splendor_board_game_cover.jpg",
    rating: 7.4,
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
    tags: ["cooperative"],
    year: 2008,
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/21/Pandemic_board_game_cover.png",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/en/2/21/Pandemic_board_game_cover.png",
    rating: 7.6,
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
    id: "68448",
    name: "7 Wonders",
    tags: ["strategy", "euro"],
    year: 2010,
    badge: "Card Drafting",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/21/7_Wonders_board_game_cover.jpg",
    imageLarge:
      "https://upload.wikimedia.org/wikipedia/en/2/21/7_Wonders_board_game_cover.jpg",
    rating: 7.7,
    description:
      "7 Wonders is a card-drafting game where players develop ancient civilizations and build one of the seven wonders of the world across three ages.",
    minPlayers: 2,
    maxPlayers: 7,
    minPlaytime: 30,
    maxPlaytime: 30,
    minAge: 10,
    usersRated: 74500,
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Client-side filters after search/tag fetch (keyword, player count, playtime). */
const applyClientFilters = (games, filters, limit) => {
  if (!filters || typeof filters !== "object") {
    return games.slice(0, limit);
  }
  let out = games;
  const kw = (filters.keyword || "").trim().toLowerCase();
  if (kw) {
    out = out.filter(
      (g) =>
        (g.name && g.name.toLowerCase().includes(kw)) ||
        (g.tags &&
          Array.isArray(g.tags) &&
          g.tags.some((t) => String(t).toLowerCase().includes(kw))),
    );
  }
  const minP = filters.minPlayers;
  if (minP != null && typeof minP === "number" && !Number.isNaN(minP)) {
    out = out.filter((g) => g.maxPlayers != null && g.maxPlayers >= minP);
  }
  const maxT = filters.maxPlaytime;
  if (maxT != null && typeof maxT === "number" && !Number.isNaN(maxT)) {
    out = out.filter((g) => {
      const hi = g.maxPlaytime ?? g.minPlaytime;
      if (hi == null) return true;
      return hi <= maxT;
    });
  }
  return out.slice(0, limit);
};

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

/** Ranked inventory compiled from recommend.games (BGG-derived). */
export const BOARDGAME_INDEX = Array.isArray(boardgameIndexData.games)
  ? boardgameIndexData.games
  : [];

const indexById = new Map(
  BOARDGAME_INDEX.map((g) => [String(g.id), g]),
);
const indexByName = new Map(
  BOARDGAME_INDEX.map((g) => [String(g.name || "").toLowerCase(), g]),
);

/** Overlay working BGG cover URLs from the local index. */
export const withIndexImages = (game) => {
  if (!game) return game;
  const src =
    (game.id != null ? indexById.get(String(game.id)) : null) ||
    indexByName.get(String(game.name || "").toLowerCase());
  if (!src) return game;
  return {
    ...game,
    id: src.id || game.id,
    image: src.image || game.image || null,
    imageLarge: src.imageLarge || game.imageLarge || null,
    imageViews:
      Array.isArray(src.imageViews) && src.imageViews.length > 0
        ? src.imageViews
        : game.imageViews,
  };
};

for (let i = 0; i < MOCK_GAMES.length; i += 1) {
  MOCK_GAMES[i] = withIndexImages(MOCK_GAMES[i]);
}

const searchLocalIndex = (query, filters, limit) => {
  const q = (query || "").trim().toLowerCase();
  let games = BOARDGAME_INDEX;
  if (q) {
    games = games.filter(
      (g) =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (Array.isArray(g.types) &&
          g.types.some((t) => String(t).toLowerCase().includes(q))) ||
        (Array.isArray(g.mechanics) &&
          g.mechanics.some((t) => String(t).toLowerCase().includes(q))) ||
        (Array.isArray(g.categories) &&
          g.categories.some((t) => String(t).toLowerCase().includes(q))),
    );
  }
  return applyClientFilters(games, filters, limit);
};
export const searchBoardGames = async ({
  term = "",
  tag,
  limit = 20,
  filters = null,
}) => {
  const query = (term || "").trim();

  if (tag) {
    await delay(200);
    const tagQuery = String(tag).replace(/-/g, " ");
    let games = searchLocalIndex(tagQuery, filters, limit);
    if (games.length === 0) {
      games = MOCK_GAMES.filter(
        (g) => g.tags && Array.isArray(g.tags) && g.tags.includes(tag),
      ).map((g) => ({ ...g }));
      games = applyClientFilters(games, filters, limit);
    }
    return { games, error: null };
  }

  if (!query) {
    await delay(200);
    const games = applyClientFilters(BOARDGAME_INDEX, filters, limit);
    return { games, error: null };
  }

  const localHits = searchLocalIndex(query, filters, limit);
  if (localHits.length > 0) {
    await delay(200);
    return { games: localHits, error: null };
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

    let games = searchGames.map((g) => {
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

    games = applyClientFilters(games, filters, limit).map(withIndexImages);
    return { games, error: null };
  } catch (error) {
    console.warn("BGG API failed, using local index:", error.message);
    await delay(200);
    const games = searchLocalIndex(query, filters, limit);
    return { games, error: null };
  }
};

// ─── BGG Index: Hot list + top-ranked games ──────────────────────────

const parseHotXml = (xml) => {
  const items = [];
  const regex =
    /<item\s+id="(\d+)"[^>]*rank="(\d+)"[^>]*>[\s\S]*?<name[^>]*value="([^"]+)"[\s\S]*?(?:<thumbnail[^>]*value="([^"]*)")?[\s\S]*?(?:<yearpublished[^>]*value="(\d+)")?[\s\S]*?<\/item>/g;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    items.push({
      id: m[1],
      rank: parseInt(m[2], 10),
      name: decode(m[3]),
      image: m[4] || null,
      year: m[5] ? parseInt(m[5], 10) : null,
    });
  }
  return items;
};

/** Fetch the BGG "Hot" list (top 50 trending board games). */
export const fetchBggHotList = async () => {
  try {
    const res = await fetch(`${BGG_HOT_URL}?type=boardgame`);
    if (!res.ok) throw new Error(`Hot list failed: ${res.status}`);
    const xml = await res.text();
    return { games: parseHotXml(xml).map(withIndexImages), error: null };
  } catch (e) {
    console.warn("[boardgames] fetchBggHotList", e.message);
    return { games: BOARDGAME_INDEX.slice(0, 50), error: e.message };
  }
};

// Well-known BGG IDs for top-ranked board games (curated from BGG top 200).
const TOP_GAME_IDS = [
  174430, 161936, 224517, 233078, 342942, 291457, 187645, 12333, 120677, 169786,
  182028, 167791, 193738, 173346, 220308, 284083, 316554, 246784, 312484,
  324856, 366013, 295770, 157354, 205637, 226320, 164928, 237182, 247763,
  256960, 285774, 162886, 171623, 84876, 102794, 251247, 239188, 180263, 312484,
  215312, 205059, 28720, 31260, 35677, 37111, 36218, 2651, 3076, 822, 68448, 13,
  9209, 9217, 30549, 148228, 178900, 266192, 173346, 222, 39856, 25613, 40834,
  72125, 62219, 66356, 3955, 521, 50381, 54043, 70323, 73439, 110327, 121921,
  124742, 132531, 155426, 163412, 170042, 175914, 184267, 192135, 199792,
  205398, 209010, 220877, 233867, 244521, 256916, 264220, 271320, 276025,
  281259, 295947, 302260, 312484, 317985, 324786, 329082, 341169,
];

const uniqueIds = (ids) => [...new Set(ids)];

/**
 * Return the compiled board-game index (name, date, players, types).
 * Falls back to the local JSON inventory when the live BGG API is unavailable.
 */
export const fetchBggIndex = async (onProgress) => {
  const local = BOARDGAME_INDEX;
  onProgress?.(0, local.length || 1);

  try {
    const { games: hotGames } = await fetchBggHotList();
    const hotIds = hotGames.map((g) => parseInt(g.id, 10)).filter(Boolean);
    const allIds = uniqueIds([...hotIds, ...TOP_GAME_IDS]);
    if (allIds.length === 0) {
      onProgress?.(local.length, local.length || 1);
      return { games: local, error: null };
    }

    const total = allIds.length;
    let loaded = 0;
    const allGames = [];
    for (let i = 0; i < allIds.length; i += 20) {
      const batch = allIds.slice(i, i + 20);
      try {
        const res = await fetch(
          `${BGG_THING_URL}?id=${batch.join(",")}&type=boardgame&stats=1`,
        );
        if (res.ok) {
          const xml = await res.text();
          allGames.push(...parseThingXml(xml));
        }
      } catch (_) {}
      loaded += batch.length;
      onProgress?.(Math.min(loaded, total), total);
      await delay(350);
    }

    if (allGames.length > 0) {
      allGames.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      return { games: allGames.map(withIndexImages), error: null };
    }
  } catch (e) {
    console.warn("[boardgames] fetchBggIndex", e.message);
  }

  onProgress?.(local.length, local.length || 1);
  return { games: local, error: null };
};
