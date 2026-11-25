/**
 * Reading rank (1-based) of every key column. Columns are read in alphabetical
 * key order; equal letters keep their left-to-right order (same as the backend).
 */
export function columnRanks(key: string): number[] {
  const order = [...key].map((letter, index) => ({ letter, index }));
  order.sort((a, b) => (a.letter === b.letter ? a.index - b.index : a.letter < b.letter ? -1 : 1));

  const ranks = new Array<number>(key.length);
  order.forEach(({ index }, rank) => {
    ranks[index] = rank + 1;
  });
  return ranks;
}

export interface GridCell {
  letter: string;
  padding: boolean;
}

/** Writes the message in rows under the key, padding the last row with X. */
export function buildGrid(message: string, key: string): GridCell[][] {
  if (key.length === 0 || message.length === 0) return [];

  const rows: GridCell[][] = [];
  for (let start = 0; start < message.length; start += key.length) {
    rows.push(
      Array.from({ length: key.length }, (_, column) => {
        const letter = message[start + column];
        return letter === undefined ? { letter: "X", padding: true } : { letter, padding: false };
      }),
    );
  }
  return rows;
}
