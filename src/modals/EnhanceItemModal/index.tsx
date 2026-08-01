import styles from './style.module.scss';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BaseModal } from '../BaseModal';

import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';

import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';
import { Query } from '@/store/query';
import { Utils } from '@/utils';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

/** Stamina a hired enhancement costs the blacksmith — mirrors the server rule. */
const ENHANCE_SERVICE_STAMINA_COST = 10;

/** A hired smith adds two points of chance per level, capped short of certain. */
function hiredChance(baseChance: number, blacksmithLevel: number) {
  return Math.min(baseChance + blacksmithLevel * 2, 95);
}

export function EnhanceItemModal(props: Props) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();

  const offersQuery = useQuery({
    queryKey: [Query.SERVICE_OFFERS],
    staleTime: 1000 * 10,
    enabled: !!props.isOpen,
    queryFn: () => api.professions.getServiceOffers(),
  });

  const enhanceItemMutation = useMutation({
    mutationFn: () => api.items.enhanceItem({ inventoryId: props.inventoryItem?.id ?? 0 }),
    onSuccess: (success: boolean | undefined) => {
      if (success) {
        props.onRequestClose();
      }
    },
  });

  // A hired attempt resolves either way, and the result arrives as a
  // notification, so the modal closes once the smith is done.
  const hireEnhanceMutation = useMutation({
    mutationFn: (offerId: number) => api.professions.hireEnhance({ offerId, inventoryId: props.inventoryItem?.id ?? 0 }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Query.SERVICE_OFFERS] });
      props.onRequestClose();
    },
  });

  const nextEnhancement = (props.inventoryItem?.enhancement ?? 0) + 1;
  const baseChance = Utils.enhanceChance(nextEnhancement);
  const forgePrice = Utils.enhancePrice(nextEnhancement);
  const silver = userStore.user?.silver ?? 0;
  const busy = enhanceItemMutation.isPending || hireEnhanceMutation.isPending;

  // Only smiths who put the service up for sale, and never yourself.
  const blacksmiths = (offersQuery.data ?? []).filter(
    (offer) => offer.enhancing && offer.crafterEmail !== userStore.user?.email,
  );

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.inventoryItem} />
        <span>Chance {baseChance}%</span>
        <Silver amount={forgePrice} />
      </div>
      <div className={styles.buttonsContainer}>
        <Button
          label="Enhance yourself"
          onClick={() => enhanceItemMutation.mutate()}
          disabled={busy || silver < forgePrice}
        />
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

            return (
              <div key={offer.id} className={styles.smithRow}>
                <div className={styles.smithText}>
                  <span className={styles.smithName}>{offer.crafter.name}</span>
                  {/* Reason sits here so the button stays one narrow column. */}
                  <span className={blockedReason ? styles.smithBlocked : styles.smithMeta}>
                    {blockedReason ?? `Lv ${level} · ${hiredChance(baseChance, level)}% chance`}
                  </span>
                </div>
                <div className={styles.smithFee}>
                  <Silver amount={fee} />
                </div>
                <Button
                  className={styles.hireButton}
                  label="Hire"
                  theme={blockedReason ? 'neutral' : 'primary'}
                  disabled={!!blockedReason || busy}
                  onClick={() => hireEnhanceMutation.mutate(offer.id)}
                />
              </div>
            );
          }}
        />
      </section>
    </BaseModal>
  );
}
