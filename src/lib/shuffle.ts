/**
 * Fisher-Yates shuffle: returns a new randomly shuffled copy of the array.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deterministic Fisher-Yates shuffle using a seeded xorshift32 PRNG.
 * Produces the same order for the same seed on both server and client,
 * preventing hydration mismatches when the initial shuffle must be stable.
 */
export function shuffleSeeded<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let s = seed || 1;
  const rand = () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
