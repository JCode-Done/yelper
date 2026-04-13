import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'gametap_voter_id';

function randomId() {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export async function getOrCreateVoterId() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const next = randomId();
    await AsyncStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return randomId();
  }
}
