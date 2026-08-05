/**
 * What a buff is actually doing, put into words.
 *
 * A meal's whole value is two percentages on a row nobody ever sees, so the
 * icon on the character sheet has always been a picture with no numbers behind
 * it. These are those numbers.
 */

export type BuffLine = {
  label: string;
  value: string;
};

/**
 * How a buff's remaining duration is counted.
 *
 * `persist` is the difference: a persisted buff is a row in the database that
 * ticks once per **fight won** (`decreaseUserBuffs`, at settle time), which is
 * what makes a meal something eaten before a night of fighting. Everything else
 * exists only inside one battle and ticks on the holder's own **turn**.
 */
export function durationUnit(buff: Buff, remaining: number) {
  const noun = buff.persist ? 'fight' : 'turn';
  return `${remaining} ${noun}${remaining === 1 ? '' : 's'}`;
}

/** The stat lines a buff grants, skipping everything it leaves alone. */
export function buffLines(held: UserBuff): BuffLine[] {
  const lines: BuffLine[] = [];
  const buff = held.buff;

  if (buff.attackBonus) lines.push({ label: 'Attack', value: `+${buff.attackBonus}%` });
  if (buff.healthBonus) lines.push({ label: 'Damage taken', value: `-${buff.healthBonus}%` });
  if (buff.critRateBonus) lines.push({ label: 'Crit rate', value: `+${buff.critRateBonus}%` });
  if (buff.critDamageBonus) lines.push({ label: 'Crit damage', value: `+${buff.critDamageBonus}%` });

  // Both of these are sized off the caster when the buff went up, so they live
  // on the holder's row rather than on the buff template — and neither means
  // anything outside a fight.
  if (held.barrier !== undefined) lines.push({ label: 'Barrier left', value: String(held.barrier) });
  if (held.regen !== undefined) lines.push({ label: 'Restored a turn', value: `+${held.regen}` });

  return lines;
}

/** One sentence on what the effect does, for the effects that are not just numbers. */
export function buffEffectHint(effect?: string) {
  switch (effect) {
    case 'well_fed':
      return 'Eaten before a fight, and it lasts across several of them.';
    case 'barrier':
      return 'Soaks damage until its pool runs out. Worth most against many small hits.';
    case 'regeneration':
      return 'Pays out at the top of each of your own turns, before any poison or burn.';
    case 'invincible':
      return 'Nothing lands while it is up.';
    case 'parry':
      return 'Turns an incoming hit aside.';
    case 'second_wind':
      return 'Puts you back on your feet the once.';
    case 'power_up':
    case 'blessed':
      return undefined;
    default:
      return undefined;
  }
}
