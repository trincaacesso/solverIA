// Single-elimination bracket generator for the CEFFLASH championship.

export interface Match {
  a: string | null; // team name, or null (BYE / awaiting result)
  b: string | null;
  winner: "a" | "b" | null;
}

export type Round = Match[];

/** Next power of two >= n (min 2). */
function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return Math.max(p, 2);
}

/**
 * Standard seeding order for `size` slots, e.g. size 4 -> [1, 4, 3, 2].
 * Guarantees top seeds are spread apart, so byes (highest seeds) never meet.
 */
function seedOrder(size: number): number[] {
  let order = [1, 2];
  while (order.length < size) {
    const len = order.length * 2;
    const next: number[] = [];
    for (const s of order) {
      next.push(s);
      next.push(len + 1 - s);
    }
    order = next;
  }
  return order;
}

/**
 * Build a full single-elimination bracket from an ordered list of team names.
 * Byes are added automatically and auto-advanced in the first round.
 */
export function buildBracket(teams: string[]): Round[] {
  const size = nextPow2(teams.length);
  const order = seedOrder(size);

  // Seed teams into slot positions (seed number -> team, else BYE/null).
  const slots = order.map((seed) => (seed <= teams.length ? teams[seed - 1] : null));

  // First round.
  const first: Round = [];
  for (let i = 0; i < size; i += 2) {
    const a = slots[i];
    const b = slots[i + 1];
    let winner: Match["winner"] = null;
    if (a && !b) winner = "a";
    else if (!a && b) winner = "b";
    first.push({ a, b, winner });
  }

  const rounds: Round[] = [first];
  let count = first.length;
  while (count > 1) {
    count = Math.floor(count / 2);
    rounds.push(Array.from({ length: count }, () => ({ a: null, b: null, winner: null })));
  }

  recomputeBracket(rounds);
  return rounds;
}

/**
 * Propagate winners forward through the bracket. Clears any downstream winner
 * that no longer matches its (possibly changed) slot.
 */
export function recomputeBracket(rounds: Round[]): void {
  for (let r = 0; r < rounds.length - 1; r++) {
    const cur = rounds[r];
    const next = rounds[r + 1];
    for (let i = 0; i < cur.length; i++) {
      const m = cur[i];
      const w = m.winner === "a" ? m.a : m.winner === "b" ? m.b : null;
      const nm = next[Math.floor(i / 2)];
      if (i % 2 === 0) nm.a = w;
      else nm.b = w;
    }
    for (const nm of next) {
      const wName = nm.winner === "a" ? nm.a : nm.winner === "b" ? nm.b : null;
      if (nm.winner && !wName) nm.winner = null;
    }
  }
}

/** Human-friendly round label based on how many matches it holds. */
export function roundLabel(matchCount: number): string {
  switch (matchCount) {
    case 1:
      return "Final";
    case 2:
      return "Semifinal";
    case 4:
      return "Quartas de Final";
    case 8:
      return "Oitavas de Final";
    case 16:
      return "16-avos de Final";
    default:
      return `Fase de ${matchCount * 2}`;
  }
}

/** The champion, if the final has been decided. */
export function championOf(rounds: Round[]): string | null {
  if (rounds.length === 0) return null;
  const final = rounds[rounds.length - 1][0];
  if (!final || !final.winner) return null;
  return final.winner === "a" ? final.a : final.b;
}
