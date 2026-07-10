/**
 * Lightweight fuzzy matcher for short static lists (docs nav has ~40 entries).
 * Characters of `query` must appear in `text` in order (subsequence match).
 * Contiguous substring matches score highest; scattered subsequence matches
 * score lower based on how contiguous the matched characters are.
 */
export function fuzzyMatch(query: string, text: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const t = text.toLowerCase();

  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    return 1000 - substringIndex;
  }

  let score = 0;
  let queryIndex = 0;
  let runLength = 0;

  for (let textIndex = 0; textIndex < t.length && queryIndex < q.length; textIndex++) {
    if (t[textIndex] === q[queryIndex]) {
      runLength++;
      score += runLength;
      queryIndex++;
    } else {
      runLength = 0;
    }
  }

  return queryIndex === q.length ? score : null;
}
