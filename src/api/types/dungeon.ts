// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  /**
   * Three bosses fought back to back on one entry a day. A map is somewhere you
   * go back to; a dungeon is a single attempt, which is why its monsters hit as
   * hard as they do and pay as well as they do.
   */
  type Dungeon = {
    id: number;
    name: string;
    image: string;
    description: string;
    /** Advisory only — nothing stops an under-levelled party from walking in. */
    recommendedLevel: number;
    sortOrder: number;
    /** Exactly the order they are fought in, first to last. */
    monsters: DungeonMonster[];
  };

  /**
   * A dungeon boss. Its own table on the server rather than a Monster: these
   * never turn up in a random pull and their numbers sit above the map curve.
   */
  type DungeonMonster = {
    id: number;
    dungeonId: number;
    /** 1, 2, 3 — where it stands on the path. */
    stage: number;
    name: string;
    image: string;
    level: number;
    attack: number;
    health: number;
    agi: number;
    defense: number;
    silver: number;
    exp: number;
    drops: DungeonDrop[];
  };

  type DungeonDrop = {
    id: number;
    monsterId: number;
    itemId: number;
    chance: number;
    minAmount: number;
    maxAmount: number;
    item: Item;
  };

  type DungeonRunStatus = 'active' | 'cleared' | 'failed';

  /**
   * One party's attempt. It outlives the individual fights, so a party knocked
   * offline between bosses picks the run back up where it stopped.
   */
  type DungeonRun = {
    id: number;
    dungeonId: number;
    leaderEmail: string;
    /** Bosses already down. The next fight is `stage + 1`. */
    stage: number;
    status: DungeonRunStatus;
    startedAt: string;
    finishedAt?: string | null;
    dungeon: Dungeon;
    members: DungeonRunMember[];
  };

  type DungeonRunMember = {
    id: number;
    dungeonRunId: number;
    userEmail: string;
    user?: { name: string; email: string; appearance?: Appearance };
  };

  /** When somebody last walked into a dungeon. Entries come back at midnight UTC. */
  type DungeonEntry = {
    userEmail: string;
    dungeonId: number;
    usedAt: string;
  };

  /**
   * The dungeon screen's whole payload: the run the player is inside, and every
   * entry held by the people they would walk in with. Both are party-wide,
   * because the entry is spent party-wide.
   */
  type DungeonStatus = {
    run?: DungeonRun | null;
    entries: DungeonEntry[];
  };

  /** Which leg of a run a battle is, shipped with the battle itself. */
  type DungeonBattleInfo = {
    runId: number;
    name: string;
    stage: number;
    totalStages: number;
  };
}
