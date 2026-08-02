/**
 * How the server reads a skill, put into words. Category decides who it hits,
 * effect splits the two supporting ones apart, and potency is
 * `attribute * multiplier * masteryLevel` — see battle.ts.
 */

export type SkillKind = 'damage' | 'heal' | 'mana' | 'buff';

export function skillKind(skill?: Skill): SkillKind {
  if (skill?.category === 'buff_self') return 'buff';
  if (skill?.category === 'target_ally') return skill.effect === 'infusion' ? 'mana' : 'heal';
  return 'damage';
}

const KIND_LABEL: Record<SkillKind, string> = {
  damage: 'Damage',
  heal: 'Heal',
  mana: 'Mana',
  buff: 'Self buff',
};

export function skillKindLabel(skill?: Skill) {
  return KIND_LABEL[skillKind(skill)];
}

export function skillTargetLabel(skill?: Skill) {
  if (skill?.category === 'buff_self') return 'Yourself';
  if (skill?.category === 'target_ally') return 'An ally';
  return 'One enemy';
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
