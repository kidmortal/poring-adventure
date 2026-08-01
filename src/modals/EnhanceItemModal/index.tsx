import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './style.module.scss';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp, FaHammer, FaHandshake } from 'react-icons/fa';

import { BaseModal } from '../BaseModal';

import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';

import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';
import { Query } from '@/store/query';
import { Utils } from '@/utils';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

/** Stamina a hired enhancement costs the blacksmith — mirrors the server rule. */
const ENHANCE_SERVICE_STAMINA_COST = 10;

/**
 * A hired smith adds a tenth of the base chance per level, never past certainty
 * — mirrors the server rule so the number shown is the number rolled.
 */
function hiredEnhanceBonus(baseChance: number, blacksmithLevel: number) {
  return Math.min(Math.round(baseChance * 0.1 * blacksmithLevel), 100 - baseChance);
}

export function EnhanceItemModal(props: Props) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const modalStore = useModalStore();
  /** The smith assisting the next attempt, or none to do it yourself. */
  const [selectedOfferId, setSelectedOfferId] = useState<number>();

  const offersQuery = useQuery({
    queryKey: [Query.SERVICE_OFFERS],
    staleTime: 1000 * 10,
    enabled: !!props.isOpen,
    queryFn: () => api.professions.getServiceOffers(),
  });

  /**
   * The last roll, kept only to play its animation. The id makes every attempt a
   * new element, so a second roll restarts the animation instead of sitting
   * still on screen.
   */
  const [outcome, setOutcome] = useState<{ id: number; success: boolean }>();

  function showOutcome(result?: { success: boolean } | false) {
    if (!result) return;
    setOutcome({ id: Date.now(), success: result.success });
  }

  const enhanceItemMutation = useMutation({
    mutationFn: () => api.items.enhanceItem({ inventoryId: props.inventoryItem?.id ?? 0 }),
    onSuccess: showOutcome,
  });

  // Every attempt stays on the modal now: the result is the animation, so you
  // can keep going without reopening it.
  const hireEnhanceMutation = useMutation({
    mutationFn: (offerId: number) => api.professions.hireEnhance({ offerId, inventoryId: props.inventoryItem?.id ?? 0 }),
    onSuccess: showOutcome,
    onSettled: () => queryClient.invalidateQueries({ queryKey: [Query.SERVICE_OFFERS] }),
  });

  // Working your own item as a blacksmith: same stamina and level bonus a
  // customer would pay for, minus the fee.
  const selfAssistedMutation = useMutation({
    mutationFn: () => api.professions.selfAssistedEnhance({ inventoryId: props.inventoryItem?.id ?? 0 }),
    onSuccess: showOutcome,
    onSettled: () => queryClient.invalidateQueries({ queryKey: [Query.SERVICE_OFFERS] }),
  });

  const nextEnhancement = (props.inventoryItem?.enhancement ?? 0) + 1;
  const baseChance = Utils.enhanceChance(nextEnhancement);
  const forgePrice = Utils.enhancePrice(nextEnhancement);
  const silver = userStore.user?.silver ?? 0;
  const busy = enhanceItemMutation.isPending || hireEnhanceMutation.isPending || selfAssistedMutation.isPending;

  // Your own trade, when it is one that can enhance.
  const ownProfession = userStore.user?.professions?.[0];
  const isBlacksmith = !!ownProfession?.profession?.canEnhance;
  const ownLevel = ownProfession?.level ?? 0;
  const ownBonus = isBlacksmith ? hiredEnhanceBonus(baseChance, ownLevel) : 0;
  const ownStamina = userStore.user?.stats?.stamina ?? 0;

  // The message plays once and leaves.
  useEffect(() => {
    if (!outcome) return;
    const timer = setTimeout(() => setOutcome(undefined), 1400);
    return () => clearTimeout(timer);
  }, [outcome]);

  // A successful roll moves the item to a new stack, so the modal follows it —
  // otherwise the next attempt would target an inventory id that is now gone.
  const item = props.inventoryItem;
  useEffect(() => {
    if (!outcome?.success || !item) return;
    const upgraded = userStore.user?.inventory?.find(
      (owned) =>
        owned.itemId === item.itemId &&
        owned.quality === item.quality &&
        owned.enhancement === item.enhancement + 1 &&
        !owned.equipped &&
        !owned.locked,
    );
    if (upgraded && upgraded.id !== item.id) {
      modalStore.setInventoryItem({ selectedItem: upgraded });
    }
  }, [outcome, userStore.user]);

  // Only smiths who put the service up for sale, and never yourself.
  const blacksmiths = (offersQuery.data ?? []).filter(
    (offer) => offer.enhancing && offer.crafterEmail !== userStore.user?.email,
  );

  const selected = blacksmiths.find((offer) => offer.id === selectedOfferId);
  const selectedLevel = selected
    ? (selected.crafter.professions.find((p) => p.professionId === selected.professionId)?.level ?? 1)
    : 0;
  const selectedBonus = selected ? hiredEnhanceBonus(baseChance, selectedLevel) : 0;
  const selectedFee = selected ? ENHANCE_SERVICE_STAMINA_COST * selected.pricePerStamina : 0;

  // Picking a smith changes what the single button at the top does, so the price
  // and the odds shown next to it follow the selection.
  const totalPrice = forgePrice + selectedFee;
  // A smith picked for a cheaper item can be out of energy by the time you come
  // back, so the selection is re-checked rather than trusted.
  const selectedUnavailable = !!selected && (selected.crafter.stats?.stamina ?? 0) < ENHANCE_SERVICE_STAMINA_COST;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        {/* Keyed by the attempt, so a second roll restarts the animation. */}
        <When value={!!outcome}>
          <span
            key={outcome?.id}
            className={cn(styles.outcome, { [styles.outcomeSuccess]: outcome?.success })}
          >
            {outcome?.success ? 'SUCCESS' : 'FAIL'}
          </span>
        </When>
        <InventoryItem inventoryItem={props.inventoryItem} />
        <span>
          Chance {baseChance}%
          <When value={!!selected}>
            <span className={styles.chanceBonus}>+{selectedBonus}%</span>
          </When>
        </span>
        <Silver amount={totalPrice} />
      </div>

      {/* Three ways to spend the attempt, and the colour says which: blue when a
          smith assists, gold for the plain attempt, green for your own trade. */}
      <div className={styles.buttonsContainer}>
        <When value={!!selected}>
          <Button
            theme="primary"
            label={
              <span className={styles.buttonLabel}>
                <FaHandshake /> Assisted enhance
              </span>
            }
            onClick={() => selected && hireEnhanceMutation.mutate(selected.id)}
            disabled={busy || silver < totalPrice || selectedUnavailable}
          />
        </When>

        <When value={!selected}>
          <Button
            theme={isBlacksmith ? 'neutral' : 'gold'}
            label={
              <span className={styles.buttonLabel}>
                <FaArrowUp /> Enhance yourself
              </span>
            }
            onClick={() => enhanceItemMutation.mutate()}
            disabled={busy || silver < forgePrice}
          />
        </When>

        <When value={!selected && isBlacksmith}>
          <Button
            theme="success"
            label={
              <span className={styles.ownSkillLabel}>
                <FaHammer />
                Use your own skill
                <span className={styles.ownSkillBonus}>+{ownBonus}%</span>
                <span className={styles.ownSkillCost}>{ENHANCE_SERVICE_STAMINA_COST} energy</span>
              </span>
            }
            onClick={() => selfAssistedMutation.mutate()}
            disabled={busy || silver < forgePrice || ownStamina < ENHANCE_SERVICE_STAMINA_COST}
          />
        </When>
      </div>

      <section className={styles.smithSection}>
        <span className={styles.sectionTitle}>Hire a blacksmith</span>
        <span className={styles.sectionHint}>
          A smith rolls better than you do — you still pay the forge price, plus their fee.
        </span>

        <When value={blacksmiths.length === 0}>
          <span className={styles.empty}>No blacksmith is offering right now</span>
        </When>

        <ForEach
          items={blacksmiths}
          render={(offer) => {
            const level = offer.crafter.professions.find((p) => p.professionId === offer.professionId)?.level ?? 1;
            const stamina = offer.crafter.stats?.stamina ?? 0;
            const fee = ENHANCE_SERVICE_STAMINA_COST * offer.pricePerStamina;

            let blockedReason: string | undefined;
            if (stamina < ENHANCE_SERVICE_STAMINA_COST) blockedReason = 'Out of energy';
            else if (silver < forgePrice + fee) blockedReason = 'Too expensive';

            const bonus = hiredEnhanceBonus(baseChance, level);

            const isSelected = offer.id === selectedOfferId;

            return (
              // The row only picks the smith — the enhancement itself is always
              // the one button at the top.
              <button
                key={offer.id}
                type="button"
                className={cn(styles.smithRow, {
                  [styles.smithSelected]: isSelected,
                  [styles.smithBlockedRow]: !!blockedReason,
                })}
                disabled={!!blockedReason || busy}
                onClick={() => setSelectedOfferId(isSelected ? undefined : offer.id)}
              >
                <div className={styles.smithText}>
                  <div className={styles.smithNameRow}>
                    <span className={styles.smithName}>{offer.crafter.name}</span>
                    <span className={styles.smithLevel}>Lv {level}</span>
                  </div>
                  <When value={!!blockedReason}>
                    <span className={styles.smithBlocked}>{blockedReason}</span>
                  </When>
                </div>
                {/* Only what their level adds — the base chance is already at the
                    top of the modal. It is the number being compared between
                    smiths, so it gets its own column and size. */}
                <span className={styles.smithBonus}>+{bonus}%</span>
                <div className={styles.smithFee}>
                  <Silver amount={fee} />
                </div>
              </button>
            );
          }}
        />
      </section>
    </BaseModal>
  );
}
