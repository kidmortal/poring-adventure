import { useState } from 'react';
import cn from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';
import { Query } from '@/store/query';
import { ITEM_QUALITY } from '@/constants';
import { Utils } from '@/utils';

type Props = {
  isOpen?: boolean;
  recipe?: Recipe;
  /** Set when the job is being bought from another player. */
  offer?: ServiceOffer;
  onRequestClose: () => void;
};

/**
 * Everything worth knowing before paying for a craft: what it eats, what it
 * costs, who is doing it and how likely each quality is at their level.
 */
export function CraftDetailsModal({ isOpen, recipe, offer, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const [result, setResult] = useState<{ recipe: string; quality: number; amount: number }>();

  const craftMutation = useMutation({
    mutationFn: () => api.professions.craft({ recipeId: recipe?.id ?? 0 }),
    onSuccess: (crafted) => crafted && setResult(crafted),
  });

  const hireMutation = useMutation({
    mutationFn: () => api.professions.hireCraft({ offerId: offer?.id ?? 0, recipeId: recipe?.id ?? 0 }),
    onSuccess: (crafted) => crafted && setResult(crafted),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [Query.SERVICE_OFFERS] }),
  });

  const user = userStore.user;
  const stamina = user?.stats?.stamina ?? 0;
  const silver = user?.silver ?? 0;

  // Equipped, locked and listed stacks are off limits server side, so they do
  // not count towards what you can spend.
  const ownedByItemId: Record<number, number> = {};
  (user?.inventory ?? [])
    .filter((item) => !item.equipped && !item.locked && !item.marketListing)
    .forEach((item) => {
      ownedByItemId[item.itemId] = (ownedByItemId[item.itemId] ?? 0) + item.stack;
    });

  const hired = !!offer;
  const crafterLevel = hired
    ? (offer.crafter.professions.find((p) => p.professionId === offer.professionId)?.level ?? 1)
    : (user?.professions?.[0]?.level ?? 0);
  const crafterName = hired ? offer.crafter.name : 'You';
  const crafterStamina = hired ? (offer.crafter.stats?.stamina ?? 0) : stamina;

  const fee = hired && recipe ? recipe.staminaCost * offer.pricePerStamina : 0;
  const missingIngredient = (recipe?.ingredients ?? []).some(
    (ingredient) => (ownedByItemId[ingredient.itemId] ?? 0) < ingredient.amount,
  );

  let blockedReason: string | undefined;
  if (!recipe) blockedReason = 'No recipe';
  else if (crafterLevel < recipe.requiredLevel)
    blockedReason = hired ? `Crafter needs level ${recipe.requiredLevel}` : `Requires level ${recipe.requiredLevel}`;
  else if (crafterStamina < recipe.staminaCost) blockedReason = hired ? 'Crafter is out of energy' : 'Not enough energy';
  else if (missingIngredient) blockedReason = 'Missing materials';
  else if (hired && silver < fee) blockedReason = 'You cannot pay the fee';

  const busy = craftMutation.isPending || hireMutation.isPending;
  const chances = Utils.craftQualityChances(crafterLevel);

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <img className={styles.resultImage} src={recipe?.item?.image} alt={recipe?.item?.name} />
        <div className={styles.identity}>
          <h2 className={styles.name}>{recipe?.name}</h2>
          <span className={styles.subtitle}>
            {recipe?.profession?.name ?? 'Crafting'} · needs Lv {recipe?.requiredLevel}
          </span>
        </div>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Materials</span>
        <ForEach
          items={recipe?.ingredients ?? []}
          render={(ingredient) => {
            const owned = ownedByItemId[ingredient.itemId] ?? 0;
            const short = owned < ingredient.amount;

            return (
              <div key={ingredient.id} className={styles.materialRow}>
                <img className={styles.materialImage} src={ingredient.item.image} alt={ingredient.item.name} />
                <span className={styles.materialName}>{ingredient.item.name}</span>
                <span className={cn(styles.materialCount, { [styles.short]: short })}>
                  {owned}/{ingredient.amount}
                </span>
              </div>
            );
          }}
        />
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Cost</span>
        <div className={styles.costRow}>
          <span className={styles.costLabel}>Energy</span>
          <span className={styles.costValue}>{recipe?.staminaCost}</span>
        </div>
        <div className={styles.costRow}>
          <span className={styles.costLabel}>{hired ? `${crafterName}'s fee` : 'Fee'}</span>
          {hired ? <Silver amount={fee} /> : <span className={styles.costValue}>none</span>}
        </div>
        <div className={styles.costRow}>
          <span className={styles.costLabel}>Experience</span>
          <span className={styles.costValue}>+{recipe?.experience} to {hired ? crafterName : 'you'}</span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.chanceHeader}>
          <span className={styles.sectionTitle}>Quality chances</span>
          <span className={styles.crafterLevel}>
            {crafterName} · Lv {crafterLevel}
          </span>
        </div>
        {/* The whole reason to hire a good crafter: their level is what these
            odds are rolled against. */}
        <ForEach
          items={chances.filter((entry) => entry.chance > 0)}
          render={(entry) => (
            <div key={entry.quality} className={styles.chanceRow}>
              <span className={cn(styles.qualityName, styles[ITEM_QUALITY[entry.quality]])}>
                {ITEM_QUALITY[entry.quality]}
              </span>
              <div className={styles.chanceBar}>
                <div className={styles.chanceFill} style={{ width: `${entry.chance}%` }} />
              </div>
              <span className={styles.chanceValue}>{entry.chance}%</span>
            </div>
          )}
        />
      </section>

      <When value={!!result}>
        <span className={styles.result}>
          Crafted {result?.amount}x {result?.recipe} —{' '}
          <b className={cn(styles.qualityName, styles[ITEM_QUALITY[result?.quality ?? 1]])}>
            {ITEM_QUALITY[result?.quality ?? 1]}
          </b>
        </span>
      </When>

      <Button
        className={styles.action}
        label={blockedReason ?? (hired ? `Hire ${crafterName}` : 'Craft')}
        theme={blockedReason ? 'neutral' : 'primary'}
        disabled={!!blockedReason || busy}
        onClick={() => (hired ? hireMutation.mutate() : craftMutation.mutate())}
      />
    </BaseModal>
  );
}
