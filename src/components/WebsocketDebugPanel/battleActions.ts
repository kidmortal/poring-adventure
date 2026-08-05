/**
 * The debug panel's battle controls, mirroring `BattleDebugAction` on the
 * server. None of these spend your turn — the fight is a state machine driven
 * by turns, and a tool that advanced it would change the thing being tested.
 *
 * Both sides carry both kinds now, so the four combinations are all here: a
 * buff or a debuff, on the party or on the enemy.
 */
export type BattleDebugAction =
  | 'heal_allies'
  | 'hurt_allies'
  | 'kill_allies'
  | 'heal_monsters'
  | 'hurt_monsters'
  | 'buff_allies'
  | 'buff_monsters'
  | 'clear_buffs'
  | 'debuff_monsters'
  | 'debuff_allies'
  | 'clear_debuffs'
  | 'restore_mana'
  | 'drain_mana'
  | 'next_turn'
  | 'enrage';

export type BattleDebugGroup = {
  title: string;
  actions: { action: BattleDebugAction; label: string; hint: string; needs?: 'buff' | 'debuff' }[];
};

export const BATTLE_DEBUG_GROUPS: BattleDebugGroup[] = [
  {
    title: 'Party',
    actions: [
      { action: 'heal_allies', label: 'Heal', hint: 'Full health and mana, and the dead stand back up' },
      { action: 'hurt_allies', label: 'Wound', hint: 'Half health each, through barriers and second wind' },
      { action: 'kill_allies', label: 'Wipe', hint: 'Ends the fight as a loss — the defeat screen' },
      { action: 'restore_mana', label: 'Mana', hint: 'Refill every pool' },
      { action: 'drain_mana', label: 'Drain', hint: 'Empty every pool, to see what is castable at zero' },
    ],
  },
  {
    title: 'Enemy',
    actions: [
      { action: 'heal_monsters', label: 'Heal', hint: 'Back to the health they stood up with' },
      { action: 'hurt_monsters', label: 'Wound', hint: 'A third of their health, banked like a real hit' },
      { action: 'enrage', label: 'Enrage', hint: 'One more stack — every swing hits harder' },
    ],
  },
  {
    title: 'Effects',
    actions: [
      { action: 'buff_allies', label: 'Buff party', hint: 'By name, or the first seeded buff', needs: 'buff' },
      { action: 'buff_monsters', label: 'Buff enemy', hint: 'Raises what it swings for, and cuts what it takes', needs: 'buff' },
      { action: 'debuff_allies', label: 'Debuff party', hint: 'Weakens, shreds, poisons or stuns them', needs: 'debuff' },
      { action: 'debuff_monsters', label: 'Debuff enemy', hint: 'By name, or the first seeded debuff', needs: 'debuff' },
      { action: 'clear_buffs', label: 'Clear buffs', hint: 'Strip both sides' },
      { action: 'clear_debuffs', label: 'Cleanse', hint: 'Strip both sides' },
    ],
  },
  {
    title: 'Flow',
    actions: [
      { action: 'next_turn', label: 'Pass turn', hint: 'The one action that does move the fight on' },
    ],
  },
];
