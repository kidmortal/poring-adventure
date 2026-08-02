/** Guild boss helpers shared by the page and its modal. */

/**
 * Entries come back once per UTC day, which is how the server decides it too
 * (users.rules isNewDay) — so every guild's day rolls over at the same instant
 * whatever the player's timezone.
 */
export function hasBossEntryToday(member?: GuildMember) {
  if (!member?.bossEntryUsedAt) return true;

  const used = new Date(member.bossEntryUsedAt);
  const now = new Date();
  return utcDay(used) !== utcDay(now);
}

function utcDay(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
}

/** Difficulties in the order they get harder, for pickers and badges. */
export const GUILD_BOSS_DIFFICULTIES: GuildBossDifficulty[] = ['easy', 'normal', 'hard', 'nightmare'];

export type DamageGroup = {
  /** Null for someone who fought alone. */
  partyKey: string | null;
  /** Whose entry heads the group. Null for a solo fight. */
  leaderEmail: string | null;
  entries: GuildBossDamage[];
  /** The party's combined score — what the group is ranked by. */
  score: number;
  /** What they hit for between them, which the member shares are read against. */
  dealt: number;
};

/**
 * Groups the ranking so a party reads as one score with the members who earned
 * it underneath. The score is banked evenly, so ranking members individually
 * would only make the order look arbitrary — what separates them is the damage
 * they actually dealt.
 */
export function groupDamageByParty(damages: GuildBossDamage[]): DamageGroup[] {
  const groups = new Map<string, DamageGroup>();

  damages.forEach((entry) => {
    // Someone who fought alone is a group of one, keyed so they never merge.
    const key = entry.partyKey || `solo:${entry.userEmail}`;
    const group = groups.get(key);
    if (group) {
      group.entries.push(entry);
      group.score += entry.damage;
      group.dealt += entry.dealtDamage ?? 0;
      group.leaderEmail = group.leaderEmail ?? entry.partyLeaderEmail ?? null;
    } else {
      groups.set(key, {
        partyKey: entry.partyKey ?? null,
        leaderEmail: entry.partyKey ? (entry.partyLeaderEmail ?? null) : null,
        entries: [entry],
        score: entry.damage,
        dealt: entry.dealtDamage ?? 0,
      });
    }
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      // Hardest hitter first, since that is what tells the members apart.
      entries: [...group.entries].sort((a, b) => (b.dealtDamage ?? 0) - (a.dealtDamage ?? 0)),
    }))
    .sort((a, b) => b.score - a.score);
}

export type BossEntryBlocker = {
  email: string;
  name: string;
  appearance?: Appearance;
  reason: string;
};

/**
 * Who in the party the server would turn away, worked out before the attempt.
 * It mirrors prepareFight: guild members only, one entry each per day. The
 * guild payload is the source for both, and it is re-pushed whenever entries
 * are spent, so this cannot go stale while the page is open.
 */
export function bossEntryBlockers(args: { participants: User[]; guild?: Guild }): BossEntryBlocker[] {
  const membersByEmail = new Map((args.guild?.members ?? []).map((member) => [member.userEmail, member]));

  return args.participants.flatMap((participant) => {
    const identity = {
      email: participant.email,
      name: participant.name,
      appearance: participant.appearance,
    };
    const member = membersByEmail.get(participant.email);

    if (!member) return [{ ...identity, reason: 'is not from the guild' }];
    if (!hasBossEntryToday(member)) return [{ ...identity, reason: `can't fight again today` }];
    return [];
  });
}

/** A member's share of what their own party hit for. */
export function contributionShare(entry: GuildBossDamage, group: DamageGroup) {
  if (group.dealt <= 0) return 0;
  return Math.round(((entry.dealtDamage ?? 0) / group.dealt) * 100);
}
