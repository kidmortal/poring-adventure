// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  /**
   * The combat archetype picked at character creation. It carries the per-level
   * stat block and the skill list. Not to be confused with Profession, which is
   * a crafting or gathering trade.
   */
  type Class = {
    id: number;
    name: string;
    /** Emoji placeholder until real artwork is added. */
    icon: string;
    description: string;
    costume: string;
    health: number;
    attack: number;
    mana: number;
    str: number;
    agi: number;
    int: number;
    skills: Skill[];
  };

  type Skill = {
    id: number;
    requiredLevel: number;
    manaCost: number;
    cooldown: number;
    category: string;
    effect: string;
    name: string;
    description: string;
    image: string;
    attribute: string;
    multiplier: number;
    classId: number;
    /** Hits every enemy, or reaches the whole party, instead of one target. */
    areaOfEffect?: boolean;
    /** What landing it leaves on the enemy, when it leaves anything. */
    debuff?: Debuff;
    /** What casting it puts on the caster or the party, when it puts anything. */
    buff?: Buff;
  };

  type LearnedSkill = {
    id: number;
    userEmail: string;
    skillId: number;
    masteryLevel: number;
    equipped: boolean;
    skill: Skill;
    cooldown: number;
  };
}
