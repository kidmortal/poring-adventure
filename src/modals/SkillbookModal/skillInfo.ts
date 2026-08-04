/**
 * How the server reads a skill, put into words. Category decides who it hits,
 * effect splits the two supporting ones apart, and potency is
 * `attribute * multiplier * masteryLevel` — see battle.ts.
 */

export type SkillKind = 'damage' | 'heal' | 'mana' | 'buff' | 'barrier';

export function skillKind(skill?: Skill): SkillKind {
  if (skill?.category === 'buff_self' || skill?.category === 'buff_party') {
    // A barrier is not the same promise as a blessing — one is health you have
    // not got yet, the other is a percentage on the health you have — so it is
    // named for what it does rather than filed under "buff".
    return skill.buff?.effect === 'barrier' ? 'barrier' : 'buff';
  }
  if (skill?.category === 'self_restore') return skill.effect === 'healing' ? 'heal' : 'mana';
  if (skill?.category === 'target_ally') return skill.effect === 'infusion' ? 'mana' : 'heal';
  return 'damage';
}

const KIND_LABEL: Record<SkillKind, string> = {
  damage: 'Damage',
  heal: 'Heal',
  mana: 'Mana',
  buff: 'Buff',
  barrier: 'Barrier',
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

  const total = skill.multiplier * (masteryLevel ?? 1);
  return `${trim(total)}× ${skill.attribute.toUpperCase()}`;
}

/** 1.5 stays 1.5, 2.0 becomes 2. */
function trim(value: number) {
  return Number(value.toFixed(2)).toString();
}
