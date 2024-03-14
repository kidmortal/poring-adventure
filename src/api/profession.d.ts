declare type Profession = {
  id: number;
  name: string;
  health: number;
  mana: number;
  str: number;
  agi: number;
  int: number;
  skills: Skill[];
};

declare type Skill = {
  id: number;
  requiredLevel: number;
  manaCost: number;
  category: string;
  effect: string;
  name: string;
  image: string;
  attribute: string;
  multiplier: number;
  professionId: number;
};

declare type LearnedSkill = {
  id: number;
  userEmail: string;
  skillId: number;
  masteryLevel: number;
  equipped: boolean;
  skill: Skill;
};
