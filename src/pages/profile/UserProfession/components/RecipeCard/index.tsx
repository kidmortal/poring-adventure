import styles from './style.module.scss';

import ForEach from '@/components/shared/ForEach';
import { ActionCard } from '../ActionCard';
import { ItemChip } from '../ItemChip';

type Props = {
  recipe: Recipe;
  /** Undefined while the profession is not learned. */
  professionLevel?: number;
  stamina: number;
  /** How many of each item the user can spend, keyed by item id. */
  ownedByItemId: Record<number, number>;
  busy?: boolean;
  lastResult?: CraftResult;
  onCraft: () => void;
};

export function RecipeCard(props: Props) {
  const { recipe, professionLevel, stamina, ownedByItemId, busy, lastResult, onCraft } = props;
  const profession = recipe.profession;
  const missingIngredient = recipe.ingredients.some((i) => (ownedByItemId[i.itemId] ?? 0) < i.amount);

  let blockedReason: string | undefined;
  if (professionLevel === undefined) {
    blockedReason = `Learn ${profession?.name ?? 'the profession'} first`;
  } else if (professionLevel < recipe.requiredLevel) {
    blockedReason = `Requires level ${recipe.requiredLevel}`;
  } else if (missingIngredient) {
    blockedReason = 'Missing ingredients';
  } else if (stamina < recipe.staminaCost) {
    blockedReason = 'Not enough stamina';
  }

  return (
    <ActionCard
      icon={profession?.icon ?? '❔'}
      title={recipe.name}
      subtitle={`${profession?.name ?? ''} · Lv ${recipe.requiredLevel}`}
      staminaCost={recipe.staminaCost}
      experience={recipe.experience}
      actionLabel="Craft"
      blockedReason={blockedReason}
      busy={busy}
      result={lastResult && <span>Crafted {lastResult.recipe}</span>}
      onAction={onCraft}
    >
      <ForEach
        items={recipe.ingredients}
        render={(ingredient) => {
          const owned = ownedByItemId[ingredient.itemId] ?? 0;
          return (
            <ItemChip
              key={ingredient.id}
              item={ingredient.item}
              amount={ingredient.amount}
              note={`have ${owned}`}
              missing={owned < ingredient.amount}
            />
          );
        }}
      />
      <span className={styles.arrow}>➜</span>
      <ItemChip item={recipe.item} amount={recipe.amount} />
    </ActionCard>
  );
}
