/**
 * How the server reads a skill, put into words. Category decides who it hits,
 * effect splits the supporting ones apart, and potency is
 * `attribute * multiplier * masteryLevel` — see battle.ts.
 *
 * Two of the kinds below scale off nothing at all: a curse is worth whatever it
 * leaves on the enemy, and a cleanse whatever the fight had already left on the
 * party.
 */

export type SkillKind = 'damage' | 'heal' | 'mana' | 'buff' | 'barrier' | 'curse' | 'cleanse';

export function skillKind(skill?: Skill): SkillKind {
  if (skill?.category === 'buff_self' || skill?.category === 'buff_party') {
    // A barrier is not the same promise as a blessing — one is health you have
    // not got yet, the other is a percentage on the health you have — so it is
    // named for what it does rather than filed under "buff".
    return skill.buff?.effect === 'barrier' ? 'barrier' : 'buff';
  }
  // A turn spent making the enemy worse rather than smaller. It deals no
  // damage at all, so filing it under damage would promise a number the player
  // is never going to see.
  if (skill?.category === 'debuff_enemy') return 'curse';
  if (skill?.category === 'self_restore') return skill.effect === 'healing' ? 'heal' : 'mana';
  if (skill?.category === 'target_ally') {
    if (skill.effect === 'cleanse') return 'cleanse';
    return skill.effect === 'infusion' ? 'mana' : 'heal';
  }
  return 'damage';
}

const KIND_LABEL: Record<SkillKind, string> = {
  damage: 'Damage',
  heal: 'Heal',
  mana: 'Mana',
  buff: 'Buff',
  barrier: 'Barrier',
  curse: 'Curse',
  cleanse: 'Cleanse',
};

/**
 * "Party buff" against "Self buff" is the distinction a player is actually
 * choosing between when they look at a support skill, so it leads the label
 * rather than being buried in the target line.
 */
export function skillKindLabel(skill?: Skill) {
  const kind = KIND_LABEL[skillKind(skill)];
  if (skill?.category === 'buff_party') return `Party ${kind.toLowerCase()}`;
  if (skill?.category === 'buff_self') return `Self ${kind.toLowerCase()}`;
  // "Area" is what a skill does to a pack of monsters. One that reaches the
  // whole party is doing something else, and says so.
  if (skill?.category === 'target_ally' && skill.areaOfEffect) return `Party ${kind.toLowerCase()}`;
  if (isAreaSkill(skill)) return `Area ${kind.toLowerCase()}`;
  return kind;
}

export function skillTargetLabel(skill?: Skill) {
  if (skill?.category === 'buff_party') return 'Whole party';
  if (skill?.category === 'buff_self' || skill?.category === 'self_restore') return 'Yourself';
  if (skill?.category === 'target_ally') return skill.areaOfEffect ? 'Whole party' : 'An ally';
  return skill?.areaOfEffect ? 'All enemies' : 'One enemy';
}

/** Whether the skill reaches more than one body, however it is categorised. */
export function isAreaSkill(skill?: Skill) {
  return !!skill?.areaOfEffect || skill?.category === 'buff_party';
}

/**
 * Whether casting it needs the player to pick somebody first. Only a
 * single-target ally skill does — everything else either has no choice to make
 * or reaches everyone anyway, and asking would be a click that changes nothing.
 */
export function needsAllyTarget(skill?: Skill) {
  return skill?.category === 'target_ally' && !skill.areaOfEffect;
}

/**
 * What the skill scales off, mastery included — that is the number the player
 * actually feels, and it is what separates a mastery 1 skill from a mastery 3.
 */
export function skillScaling(skill?: Skill, masteryLevel?: number) {
  if (!skill?.multiplier || !skill.attribute) return undefined;
  // A curse and a cleanse scale off nothing: what they are worth is written on
  // the debuff they land or the debuffs they lift, and showing the multiplier
  // the row happens to carry would be a number that means nothing.
  if (skillKind(skill) === 'curse' || skillKind(skill) === 'cleanse') return undefined;

  const total = skill.multiplier * (masteryLevel ?? 1);
  return `${trim(total)}× ${skill.attribute.toUpperCase()}`;
}

/** 1.5 stays 1.5, 2.0 becomes 2. */
function trim(value: number) {
  return Number(value.toFixed(2)).toString();
}
