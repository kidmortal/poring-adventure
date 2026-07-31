/** Compact level summary for a group of monsters, e.g. "Lv 1-5". */
export function levelRange(monsters: Monster[]) {
  const levels = monsters.map((monster) => monster.level);
  if (!levels.length) return '';

  const min = Math.min(...levels);
  const max = Math.max(...levels);
  return min === max ? `Lv ${min}` : `Lv ${min}-${max}`;
}
