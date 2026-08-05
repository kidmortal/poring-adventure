export type BattleEffect = {
  name: string;
  image: string;
  /** Turns of the carrier's own turns still to run. */
  duration: number;
  tone: 'buff' | 'debuff';
  /** What is left of a barrier's pool, on the one buff that has one. */
  barrier?: number;
};

/** A player's or a monster's buffs, in the shape the row draws. */
export function buffEffects(buffs?: UserBuff[]): BattleEffect[] {
  return (buffs ?? []).map((held) => ({
    name: held.buff.name,
    image: held.buff.image,
    duration: held.duration,
    tone: 'buff',
    barrier: held.barrier,
  }));
}

export function debuffEffects(debuffs?: BattleDebuff[]): BattleEffect[] {
  return (debuffs ?? []).map((debuff) => ({
    name: debuff.name,
    image: debuff.image,
    duration: debuff.duration,
    tone: 'debuff',
  }));
}

/**
 * What the battle bar is for: the buffs this fight put on, and nothing else.
 *
 * A meal is a decision made before the fight and it lasts across several, so it
 * belongs on the character sheet with the rest of the standing numbers. On the
 * bar it was noise that never changed, crowding out the barrier that has four
 * points left and the blessing with one turn to run.
 */
export function battleBuffs(buffs?: UserBuff[]) {
  return (buffs ?? []).filter((held) => !held.buff.persist);
}
