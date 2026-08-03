import cn from 'classnames';
import styles from './style.module.scss';

import ForEach from '@/components/shared/ForEach';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';

type Props = {
  offer: ServiceOffer;
  /** Recipes of the offer's profession — what this crafter can be hired for. */
  recipes: Recipe[];
  /** How many of each item the hirer can spend, keyed by item id. */
  ownedByItemId: Record<number, number>;
  silver: number;
  /** Your own offer is shown for reference, but you cannot hire yourself. */
  isSelf?: boolean;
  busy?: boolean;
  lastResult?: HiredCraftResult;
  onHire: (recipeId: number) => void;
};

/** The crafter's level in the profession they are selling. */
function offerLevel(offer: ServiceOffer) {
  return offer.crafter.professions.find((p) => p.professionId === offer.professionId)?.level ?? 1;
}

export function HireOfferCard({ offer, recipes, ownedByItemId, silver, isSelf, busy, lastResult, onHire }: Props) {
  const stamina = offer.crafter.stats?.stamina ?? 0;
  const maxStamina = offer.crafter.stats?.maxStamina ?? 0;
  const level = offerLevel(offer);

  // Only what this crafter could actually make. Their level gates the job
  // server side, so listing the rest is a row that can never be clicked — and
  // unlike their energy or your materials, it is not something that resolves on
  // its own by waiting or going shopping.
  const craftable = recipes.filter((recipe) => recipe.requiredLevel <= level);
  const lockedByLevel = recipes.length - craftable.length;

  return (
    <div className={cn(styles.container, { [styles.depleted]: stamina <= 0 })}>
      <header className={styles.header}>
        <span className={styles.icon}>{offer.profession.icon}</span>
        <div className={styles.headerText}>
          <div className={styles.nameRow}>
            <h3>{offer.crafter.name}</h3>
            <When value={!!isSelf}>
              <span className={styles.youBadge}>you</span>
            </When>
          </div>
          <span className={styles.subtitle}>
            {offer.profession.name} · Lv {level}
          </span>
        </div>
        <div className={styles.rate}>
          <Silver amount={offer.pricePerStamina} />
          <span className={styles.rateSuffix}>per energy</span>
        </div>
      </header>

      <div className={styles.energyRow}>
        <span className={cn(styles.energy, { [styles.energyEmpty]: stamina <= 0 })}>
          {stamina} / {maxStamina} energy left
        </span>
        <div className={styles.services}>
          <When value={offer.crafting}>
            <span className={styles.serviceBadge}>crafting</span>
          </When>
          <When value={offer.enhancing}>
            <span className={styles.serviceBadge}>enhancing</span>
          </When>
        </div>
      </div>

      <When value={offer.crafting && recipes.length === 0}>
        <span className={styles.empty}>No recipe available for this trade</span>
      </When>
      <When value={offer.crafting && recipes.length > 0 && craftable.length === 0}>
        <span className={styles.empty}>Not levelled far enough to craft anything yet</span>
      </When>

      <ForEach
        items={offer.crafting ? craftable : []}
        render={(recipe) => {
          const fee = recipe.staminaCost * offer.pricePerStamina;
          const missingIngredient = recipe.ingredients.some((i) => (ownedByItemId[i.itemId] ?? 0) < i.amount);

          // What is left that can stop the job. Their level is already handled
          // by not listing the recipe at all.
          let blockedReason: string | undefined;
          if (isSelf) blockedReason = 'Your own offer';
          else if (stamina < recipe.staminaCost) blockedReason = 'Crafter is out of energy';
          else if (missingIngredient) blockedReason = 'You are missing materials';
          else if (silver < fee) blockedReason = 'You cannot pay the fee';

          return (
            <div key={recipe.id} className={styles.recipeRow}>
              <div className={styles.recipeText}>
                <span className={styles.recipeName}>{recipe.name}</span>
                {/* The reason lives here rather than on the button, which stays
                    one narrow column whatever it has to say. */}
                <span className={cn(styles.recipeMeta, { [styles.recipeBlocked]: !!blockedReason })}>
                  {blockedReason ?? `Lv ${recipe.requiredLevel} · ${recipe.staminaCost} energy`}
                </span>
              </div>
              <div className={styles.recipeFee}>
                <Silver amount={fee} />
              </div>
              <Button
                className={styles.hireButton}
                label="Hire"
                theme={blockedReason ? 'neutral' : 'primary'}
                disabled={!!blockedReason || busy}
                onClick={() => onHire(recipe.id)}
              />
            </div>
          );
        }}
      />

      {/* Said once, quietly, rather than as a row per locked recipe: the list is
          shorter than the trade because of their level, not because the trade
          is that small. */}
      <When value={offer.crafting && lockedByLevel > 0 && craftable.length > 0}>
        <span className={styles.lockedNote}>
          {lockedByLevel} more {lockedByLevel === 1 ? 'recipe' : 'recipes'} at higher levels
        </span>
      </When>

      <When value={!!lastResult}>
        <span className={styles.result}>
          {lastResult?.crafter} crafted {lastResult?.amount}x {lastResult?.recipe} for {lastResult?.fee} silver
        </span>
      </When>
    </div>
  );
}
