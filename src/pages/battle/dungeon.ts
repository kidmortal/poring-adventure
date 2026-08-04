/** Dungeon helpers shared by the tab, its cards and the boss sheet. */

/**
 * Entries come back once per UTC day, which is how the server decides it too
 * (users.rules isNewDay) — so every party's day rolls over at the same instant
 * whatever the player's timezone.
 */
export function hasEntryToday(entry?: DungeonEntry) {
  if (!entry) return true;

  return utcDay(new Date(entry.usedAt)) !== utcDay(new Date());
}

function utcDay(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
}

export type DungeonBlocker = {
  email: string;
  name: string;
  appearance?: Appearance;
};

/**
 * Who in the party the server would turn away, worked out before the attempt.
 * It mirrors prepareEntry: one entry per player per dungeon per day, and the
 * entry is spent by everyone who walks in, so one spent member stops them all.
 */
export function entryBlockers(args: {
  participants: User[];
  entries: DungeonEntry[];
  dungeonId: number;
}): DungeonBlocker[] {
  const spent = new Map(
    args.entries.filter((entry) => entry.dungeonId === args.dungeonId).map((entry) => [entry.userEmail, entry]),
  );

  return args.participants
    .filter((participant) => !hasEntryToday(spent.get(participant.email)))
    .map((participant) => ({
      email: participant.email,
      name: participant.name,
      appearance: participant.appearance,
    }));
}

export type StageState = 'cleared' | 'next' | 'locked';

/**
 * Where one boss stands relative to the run: already down, the one the party is
 * walking into, or still further along the path. Outside a run every boss is
 * `locked` — nothing has been cleared and nothing is next yet.
 */
export function stageState(stage: number, run?: DungeonRun | null): StageState {
  if (!run || run.status !== 'active') return 'locked';
  if (stage <= run.stage) return 'cleared';
  if (stage === run.stage + 1) return 'next';
  return 'locked';
}

/** "Lv 25–30" across a dungeon's bosses, for the card header. */
export function bossLevelRange(monsters: DungeonMonster[]) {
  const levels = monsters.map((monster) => monster.level);
  if (!levels.length) return '';

  const min = Math.min(...levels);
  const max = Math.max(...levels);
  return min === max ? `Lv ${min}` : `Lv ${min}–${max}`;
}

/** What a full clear is worth, which is the number worth comparing dungeons on. */
export function totalRewards(monsters: DungeonMonster[]) {
  return monsters.reduce(
    (total, monster) => ({ silver: total.silver + monster.silver, exp: total.exp + monster.exp }),
    { silver: 0, exp: 0 },
  );
}
