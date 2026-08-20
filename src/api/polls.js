import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, hasMinimumConfig } from '../config/firebase';

export const POLL_OPTION_COUNT = 10;
/** Minimum filled game titles required to create a poll */
export const POLL_MIN_OPTIONS = 2;
export const DEFAULT_TARGET_TOTAL_VOTES = 100;

export const POLL_DUPLICATE_ENTRY_ERROR =
  'That entry has already been used. Please enter a new entry.';

/** Case-insensitive duplicate check among non-empty trimmed slots. */
export function getPollDuplicateErrorFromSlots(slots) {
  const seen = new Set();
  for (const s of slots) {
    const t = (s || '').trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) return POLL_DUPLICATE_ENTRY_ERROR;
    seen.add(key);
  }
  return null;
}

/** Indices of non-empty rows that share a title with another row (case-insensitive). */
export function getPollDuplicateIndices(slots) {
  const keyToIndices = new Map();
  slots.forEach((s, i) => {
    const t = (s || '').trim();
    if (!t) return;
    const key = t.toLowerCase();
    if (!keyToIndices.has(key)) keyToIndices.set(key, []);
    keyToIndices.get(key).push(i);
  });
  const indices = new Set();
  for (const list of keyToIndices.values()) {
    if (list.length > 1) list.forEach((i) => indices.add(i));
  }
  return indices;
}

const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

/** @type {Record<string, object>} */
let localPolls = {};
let localNextId = 1;

function countsObjectToArray(voteCounts) {
  return Array.from({ length: POLL_OPTION_COUNT }, (_, i) => {
    const v = voteCounts?.[String(i)];
    return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
  });
}

function emptyVoteCounts() {
  return Object.fromEntries(
    Array.from({ length: POLL_OPTION_COUNT }, (_, i) => [String(i), 0]),
  );
}

function normalizePoll(id, raw) {
  const items = Array.isArray(raw.items) ? raw.items.slice(0, POLL_OPTION_COUNT) : [];
  while (items.length < POLL_OPTION_COUNT) items.push('');
  return {
    id,
    theme: raw.theme ?? '',
    items,
    voteCounts: countsObjectToArray(raw.voteCounts),
    targetTotalVotes:
      typeof raw.targetTotalVotes === 'number' && raw.targetTotalVotes > 0
        ? raw.targetTotalVotes
        : DEFAULT_TARGET_TOTAL_VOTES,
    createdByName: raw.createdByName ?? '',
    createdByVoterId: raw.createdByVoterId ?? '',
    createdAt: raw.createdAt ?? null,
    lastVoteAt: raw.lastVoteAt ?? null,
    completedAt: raw.completedAt ?? null,
    recentEvents: Array.isArray(raw.recentEvents) ? raw.recentEvents : [],
  };
}

function totalVotesFromCounts(counts) {
  return counts.reduce((a, b) => a + b, 0);
}

function progressFraction(poll) {
  const t = totalVotesFromCounts(poll.voteCounts);
  const cap = poll.targetTotalVotes || DEFAULT_TARGET_TOTAL_VOTES;
  return Math.min(1, t / cap);
}

export function isPollsCloudEnabled() {
  return Boolean(hasMinimumConfig() && db);
}

export async function createPoll({
  theme,
  items,
  createdByName,
  createdByVoterId,
  targetTotalVotes = DEFAULT_TARGET_TOTAL_VOTES,
}) {
  const trimmedTheme = (theme || '').trim();
  const trimmedSlots = items.map((s) => (s || '').trim()).slice(0, POLL_OPTION_COUNT);
  const paddedItems = [...trimmedSlots];
  while (paddedItems.length < POLL_OPTION_COUNT) paddedItems.push('');
  const filledCount = paddedItems.filter((t) => t.length > 0).length;
  if (!trimmedTheme) {
    return { pollId: null, error: 'Add a theme for this poll.' };
  }
  if (filledCount < POLL_MIN_OPTIONS) {
    return {
      pollId: null,
      error: `Add at least ${POLL_MIN_OPTIONS} board games (optional slots can stay empty).`,
    };
  }
  const dupErr = getPollDuplicateErrorFromSlots(paddedItems);
  if (dupErr) {
    return { pollId: null, error: dupErr };
  }
  const cap =
    typeof targetTotalVotes === 'number' && targetTotalVotes > 0
      ? Math.floor(targetTotalVotes)
      : DEFAULT_TARGET_TOTAL_VOTES;

  if (isPollsCloudEnabled()) {
    try {
      const ref = await addDoc(collection(db, 'polls'), {
        theme: trimmedTheme,
        items: paddedItems,
        voteCounts: emptyVoteCounts(),
        targetTotalVotes: cap,
        createdByName: createdByName || 'Anonymous',
        createdByVoterId: createdByVoterId || '',
        createdAt: serverTimestamp(),
        lastVoteAt: null,
        completedAt: null,
      });
      return { pollId: ref.id, error: null };
    } catch (e) {
      console.warn('[polls] createPoll Firestore', e);
      return { pollId: null, error: e.message || 'Could not create poll.' };
    }
  }

  const id = `local_${localNextId++}`;
  const now = new Date().toISOString();
  localPolls[id] = {
    theme: trimmedTheme,
    items: paddedItems,
    voteCounts: emptyVoteCounts(),
    targetTotalVotes: cap,
    createdByName: createdByName || 'Anonymous',
    createdByVoterId: createdByVoterId || '',
    createdAt: now,
    lastVoteAt: null,
    completedAt: null,
    recentEvents: [],
  };
  notify();
  return { pollId: id, error: null };
}

export function subscribePollList(callback) {
  if (isPollsCloudEnabled()) {
    const q = query(
      collection(db, 'polls'),
      orderBy('createdAt', 'desc'),
      limit(40),
    );
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => normalizePoll(d.id, d.data()));
        callback(list);
      },
      (err) => {
        console.warn('[polls] list snapshot', err);
        callback([]);
      },
    );
  }

  const emit = () => {
    const list = Object.keys(localPolls)
      .map((id) => normalizePoll(id, localPolls[id]))
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    callback(list);
  };
  emit();
  listeners.add(emit);
  return () => listeners.delete(emit);
}

export function subscribePoll(pollId, callback) {
  if (!pollId) return () => {};

  if (isPollsCloudEnabled()) {
    const ref = doc(db, 'polls', pollId);
    return onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          callback(null);
          return;
        }
        callback(normalizePoll(snap.id, snap.data()));
      },
      (err) => {
        console.warn('[polls] poll snapshot', err);
        callback(null);
      },
    );
  }

  const emit = () => {
    const raw = localPolls[pollId];
    callback(raw ? normalizePoll(pollId, raw) : null);
  };
  emit();
  listeners.add(emit);
  return () => listeners.delete(emit);
}

export function subscribePollEvents(pollId, callback) {
  if (!pollId) return () => {};

  if (isPollsCloudEnabled()) {
    const q = query(
      collection(db, 'polls', pollId, 'events'),
      orderBy('votedAt', 'desc'),
      limit(80),
    );
    return onSnapshot(
      q,
      (snap) => {
        const events = snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            optionIndex: x.optionIndex,
            voterId: x.voterId,
            voterName: x.voterName,
            votedAt: x.votedAt,
          };
        });
        callback(events);
      },
      (err) => {
        console.warn('[polls] events snapshot', err);
        callback([]);
      },
    );
  }

  const emit = () => {
    const raw = localPolls[pollId];
    const events = raw?.recentEvents ? [...raw.recentEvents].reverse() : [];
    callback(events);
  };
  emit();
  listeners.add(emit);
  return () => listeners.delete(emit);
}

export async function castVote(pollId, optionIndex, { voterId, voterName }) {
  if (
    typeof optionIndex !== 'number' ||
    optionIndex < 0 ||
    optionIndex >= POLL_OPTION_COUNT
  ) {
    return { ok: false, error: 'Invalid choice.' };
  }

  if (isPollsCloudEnabled()) {
    const pollRef = doc(db, 'polls', pollId);
    try {
      if (voterId) {
        const dupeQuery = query(
          collection(db, 'polls', pollId, 'events'),
          where('voterId', '==', voterId),
          limit(1),
        );
        const dupeSnap = await getDocs(dupeQuery);
        if (!dupeSnap.empty) {
          return { ok: false, error: 'You have already voted on this poll.' };
        }
      }

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(pollRef);
        if (!snap.exists()) throw new Error('Poll not found.');
        const d = snap.data();
        if (d.completedAt) throw new Error('This poll is complete.');
        const pollItems = Array.isArray(d.items) ? d.items : [];
        if (!((pollItems[optionIndex] || '').trim())) {
          throw new Error('Invalid choice.');
        }

        const vc = { ...emptyVoteCounts(), ...d.voteCounts };
        const key = String(optionIndex);
        vc[key] = (vc[key] || 0) + 1;
        const arr = countsObjectToArray(vc);
        const total = totalVotesFromCounts(arr);
        const target = d.targetTotalVotes || DEFAULT_TARGET_TOTAL_VOTES;

        const eventRef = doc(collection(db, 'polls', pollId, 'events'));
        transaction.set(eventRef, {
          optionIndex,
          voterId: voterId || '',
          voterName: voterName || 'Anonymous',
          votedAt: serverTimestamp(),
        });

        transaction.update(pollRef, {
          voteCounts: vc,
          lastVoteAt: serverTimestamp(),
          ...(total >= target ? { completedAt: serverTimestamp() } : {}),
        });
      });
      return { ok: true, error: null };
    } catch (e) {
      console.warn('[polls] castVote', e);
      return { ok: false, error: e.message || 'Vote failed.' };
    }
  }

  const raw = localPolls[pollId];
  if (!raw) return { ok: false, error: 'Poll not found.' };
  if (raw.completedAt) return { ok: false, error: 'This poll is complete.' };
  const pollItems = Array.isArray(raw.items) ? raw.items : [];
  if (!((pollItems[optionIndex] || '').trim())) {
    return { ok: false, error: 'Invalid choice.' };
  }
  if (voterId && raw.recentEvents?.some((e) => e.voterId === voterId)) {
    return { ok: false, error: 'You have already voted on this poll.' };
  }

  const vc = countsObjectToArray(raw.voteCounts);
  vc[optionIndex] += 1;
  const voteCountsObj = Object.fromEntries(
    vc.map((n, i) => [String(i), n]),
  );
  const total = totalVotesFromCounts(vc);
  const target = raw.targetTotalVotes || DEFAULT_TARGET_TOTAL_VOTES;
  const now = new Date().toISOString();

  const event = {
    id: `ev_${Date.now()}`,
    optionIndex,
    voterId: voterId || '',
    voterName: voterName || 'Anonymous',
    votedAt: now,
  };
  const recent = [...(raw.recentEvents || []), event].slice(-100);

  localPolls[pollId] = {
    ...raw,
    voteCounts: voteCountsObj,
    lastVoteAt: now,
    completedAt: total >= target ? now : raw.completedAt,
    recentEvents: recent,
  };
  notify();
  return { ok: true, error: null };
}

export { totalVotesFromCounts, progressFraction };
