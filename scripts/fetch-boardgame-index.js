/**
 * Fetch a ranked board-game inventory from recommend.games
 * (BoardGameGeek-derived) and write src/data/boardgameIndex.json
 *
 * Usage: node scripts/fetch-boardgame-index.js
 *        node scripts/fetch-boardgame-index.js --enrich
 *        node scripts/fetch-boardgame-index.js --images
 */

const fs = require('fs');
const path = require('path');

const API = 'https://recommend.games/api/games/';
const PAGE_SIZE = 25;
const TARGET_COUNT = 1000;
const DELAY_MS = 250;
const IMAGE_CONCURRENCY = 4;
const IMAGE_VIEWS = 5;
const GEEKDO_IMAGES = 'https://api.geekdo.com/api/images';
const USER_AGENT = 'GameTap/1.0 (boardgame index compile; local expo app)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

const playersLabel = (min, max) => {
  if (min == null && max == null) return null;
  if (min == max || max == null) return `${min}`;
  if (min == null) return `${max}`;
  return `${min}–${max}`;
};

const normalizeGame = (g) => {
  const mechanics = Array.isArray(g.mechanic_name) ? g.mechanic_name.filter(Boolean) : [];
  const gameTypes = Array.isArray(g.game_type_name) ? g.game_type_name.filter(Boolean) : [];
  const categories = Array.isArray(g.category_name) ? g.category_name.filter(Boolean) : [];
  const types = [...new Set([...mechanics, ...gameTypes])];
  const minPlayers = g.min_players ?? null;
  const maxPlayers = g.max_players ?? null;
  const image = Array.isArray(g.image_url) ? g.image_url[1] || g.image_url[0] || null : null;
  const imageLarge = Array.isArray(g.image_url) ? g.image_url[0] || null : null;

  return {
    id: g.bgg_id != null ? String(g.bgg_id) : null,
    name: g.name || null,
    date: g.year ?? null,
    year: g.year ?? null,
    minPlayers,
    maxPlayers,
    players: playersLabel(minPlayers, maxPlayers),
    types,
    mechanics,
    gameTypes,
    categories,
    rating: g.avg_rating != null ? Number(Number(g.avg_rating).toFixed(2)) : null,
    rank: g.bgg_rank ?? null,
    image,
    imageLarge,
    description: stripHtml(g.description) || null,
  };
};

const headers = { 'User-Agent': USER_AGENT, Accept: 'application/json' };

async function fetchPage(page) {
  const url = `${API}?ordering=-bayes_rating&page_size=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} on page ${page}`);
  }
  return res.json();
}

async function fetchGameById(id) {
  const res = await fetch(`${API}${id}/`, { headers });
  if (!res.ok) return null;
  return res.json();
}

function indexPath() {
  return path.join(__dirname, '..', 'src', 'data', 'boardgameIndex.json');
}

function writeIndex(games) {
  const outPath = indexPath();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const payload = {
    source: 'recommend.games (BoardGameGeek-derived inventory)',
    sourceUrl: 'https://recommend.games/api/games/',
    fetchedAt: new Date().toISOString(),
    count: games.length,
    fields: ['name', 'date', 'players', 'types', 'description', 'imageViews'],
    games,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  return outPath;
}

async function enrichExisting() {
  const outPath = indexPath();
  if (!fs.existsSync(outPath)) {
    throw new Error(`No index at ${outPath}; run without --enrich to build one.`);
  }
  const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const games = data.games || [];
  const needed = new Set(games.map((g) => g.id).filter(Boolean));
  const descriptions = new Map();

  let page = 1;
  while (descriptions.size < needed.size && page <= 60) {
    process.stdout.write(
      `Fetching descriptions page ${page} (${descriptions.size}/${needed.size})...\n`,
    );
    const body = await fetchPage(page);
    const results = body.results || [];
    if (results.length === 0) break;
    for (const raw of results) {
      const id = raw.bgg_id != null ? String(raw.bgg_id) : null;
      if (!id || !needed.has(id) || descriptions.has(id)) continue;
      const desc = stripHtml(raw.description);
      if (desc) descriptions.set(id, desc);
    }
    if (!body.next) break;
    page += 1;
    await sleep(DELAY_MS);
  }

  let filledFromDetail = 0;
  for (const game of games) {
    if (descriptions.has(game.id)) continue;
    process.stdout.write(`Fetching detail for ${game.id} ${game.name}...\n`);
    try {
      const raw = await fetchGameById(game.id);
      const desc = stripHtml(raw?.description);
      if (desc) {
        descriptions.set(game.id, desc);
        filledFromDetail += 1;
      }
    } catch (_) {}
    await sleep(DELAY_MS);
  }

  let withDesc = 0;
  for (const game of games) {
    const desc = descriptions.get(game.id) || game.description || null;
    game.description = desc;
    if (desc) withDesc += 1;
  }

  const written = writeIndex(games);
  process.stdout.write(
    `Wrote descriptions for ${withDesc}/${games.length} games (${filledFromDetail} via detail) to ${written}\n`,
  );
}

const picIdFromUrl = (url) => {
  const m = String(url || '').match(/\/pic(\d+)/i) || String(url || '').match(/pic(\d+)/i);
  return m ? m[1] : null;
};

async function fetchBggImageList(bggId, gallery) {
  const url = `${GEEKDO_IMAGES}?objectid=${encodeURIComponent(bggId)}&objecttype=thing&showcount=20&gallery=${gallery}&sort=hot`;
  const res = await fetch(url, { headers });
  if (res.status === 429) {
    await sleep(1500);
    const retry = await fetch(url, { headers });
    if (!retry.ok) return [];
    const body = await retry.json();
    return Array.isArray(body.images) ? body.images : [];
  }
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body.images) ? body.images : [];
}

function pickImageViews(images, coverUrl, count) {
  const coverPic = picIdFromUrl(coverUrl);
  const seen = new Set(coverPic ? [coverPic] : []);
  const views = [];
  for (const img of images) {
    const url = img.imageurl_lg || img['imageurl@2x'] || img.imageurl;
    if (!url) continue;
    const pic = String(img.imageid || picIdFromUrl(url) || url);
    if (seen.has(pic)) continue;
    seen.add(pic);
    views.push({
      url,
      caption: stripHtml(img.caption) || null,
    });
    if (views.length >= count) break;
  }
  return views;
}

async function fetchFiveViews(game) {
  const cover = game.imageLarge || game.image;
  let images = await fetchBggImageList(game.id, 'game');
  let views = pickImageViews(images, cover, IMAGE_VIEWS);
  if (views.length < IMAGE_VIEWS) {
    await sleep(120);
    const extra = await fetchBggImageList(game.id, 'all');
    views = pickImageViews([...images, ...extra], cover, IMAGE_VIEWS);
  }
  await sleep(80);
  return views;
}

async function mapPool(items, limit, fn) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const idx = next++;
      await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

async function enrichImages() {
  const outPath = indexPath();
  if (!fs.existsSync(outPath)) {
    throw new Error(`No index at ${outPath}; run without flags to build one.`);
  }
  const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const games = data.games || [];
  const pending = games.filter(
    (g) => g.id && (!Array.isArray(g.imageViews) || g.imageViews.length < IMAGE_VIEWS),
  );
  process.stdout.write(`Fetching ${IMAGE_VIEWS} extra views for ${pending.length} games...\n`);

  let done = games.length - pending.length;
  let writeQueue = Promise.resolve();
  const save = () => {
    writeQueue = writeQueue.then(() => {
      writeIndex(games);
    });
    return writeQueue;
  };

  await mapPool(pending, IMAGE_CONCURRENCY, async (game) => {
    try {
      game.imageViews = await fetchFiveViews(game);
    } catch (err) {
      game.imageViews = Array.isArray(game.imageViews) ? game.imageViews : [];
      process.stderr.write(`Failed ${game.id} ${game.name}: ${err.message}\n`);
    }
    done += 1;
    if (done % 20 === 0 || done === games.length) {
      await save();
      process.stdout.write(`Saved ${done}/${games.length}\n`);
    }
  });

  const complete = games.filter((g) => (g.imageViews || []).length >= IMAGE_VIEWS).length;
  const written = writeIndex(games);
  process.stdout.write(
    `Wrote image views (${complete}/${games.length} with ${IMAGE_VIEWS}+) to ${written}\n`,
  );
}

async function main() {
  const games = [];
  const seen = new Set();
  let page = 1;
  let total = null;

  while (games.length < TARGET_COUNT) {
    process.stdout.write(`Fetching page ${page} (${games.length}/${TARGET_COUNT})...\n`);
    const data = await fetchPage(page);
    if (total == null) total = data.count;
    const results = data.results || [];
    if (results.length === 0) break;

    for (const raw of results) {
      if (!raw?.name || raw.year == null || raw.year < 1800) continue;
      const id = raw.bgg_id != null ? String(raw.bgg_id) : raw.name;
      if (seen.has(id)) continue;
      seen.add(id);
      games.push(normalizeGame(raw));
      if (games.length >= TARGET_COUNT) break;
    }

    if (!data.next) break;
    page += 1;
    await sleep(DELAY_MS);
  }

  games.sort((a, b) => (a.rank ?? 999999) - (b.rank ?? 999999));
  const written = writeIndex(games);
  process.stdout.write(`Wrote ${games.length} games to ${written}\n`);
}

const enrich = process.argv.includes('--enrich');
const images = process.argv.includes('--images');
const run = images ? enrichImages : enrich ? enrichExisting : main;
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
