import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import styles from './style.module.scss';

import { useWebsocketApi } from '@/api/websocketServer';
import ForEach from '@/components/shared/ForEach';
import { TabOption, Tabs } from '@/components/shared/Tabs';
import { When } from '@/components/shared/When';
import { StatBar } from '@/components/StatsComponents/StatBar';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';
import { Query } from '@/store/query';

import { GatheringNodeCard } from './components/GatheringNodeCard';
import { ProfessionCard } from './components/ProfessionCard';
import { RecipeCard } from './components/RecipeCard';
import { HireOfferCard } from './components/HireOfferCard';
import { ServiceOfferForm } from './components/ServiceOfferForm';
import { ProfessionFilter, ProfessionFilterValue } from './components/ProfessionFilter';

type ProfessionTab = 'professions' | 'gather' | 'craft' | 'hire';

/**
 * Crafting and gathering. Every action here is priced in stamina, which refills
 * once a day, so the whole page is built around that budget.
 */
export function UserProfession() {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const modalStore = useModalStore();
  const [showing, setShowing] = useState<ProfessionTab>('professions');
  const [gatherResults, setGatherResults] = useState<Record<number, GatherResult>>({});
  const [hireFilter, setHireFilter] = useState<ProfessionFilterValue>('all');

  const professionsQuery = useQuery({
    queryKey: [Query.ALL_PROFESSIONS],
    staleTime: 1000 * 60,
    queryFn: () => api.professions.getAllProfessions(),
  });

  const nodesQuery = useQuery({
    queryKey: [Query.GATHERING_NODES],
    staleTime: 1000 * 60,
    queryFn: () => api.professions.getGatheringNodes(),
  });

  const recipesQuery = useQuery({
    queryKey: [Query.RECIPES],
    staleTime: 1000 * 60,
    queryFn: () => api.professions.getRecipes(),
  });

  // Learning, gathering and crafting all push a fresh profile over
  // `user_update`, so the store already carries the new stamina and levels.
  const learnMutation = useMutation({
    mutationFn: (professionId: number) => api.professions.learnProfession({ professionId }),
  });

  const gatherMutation = useMutation({
    mutationFn: (nodeId: number) => api.professions.gather({ nodeId }),
    onSuccess: (result, nodeId) => {
      if (result) setGatherResults((current) => ({ ...current, [nodeId]: result }));
    },
  });

  // The hiring board is other players' stamina and prices, so it goes stale as
  // soon as anyone is hired.
  const offersQuery = useQuery({
    queryKey: [Query.SERVICE_OFFERS],
    staleTime: 1000 * 10,
    queryFn: () => api.professions.getServiceOffers(),
  });

  function invalidateOffers() {
    queryClient.invalidateQueries({ queryKey: [Query.SERVICE_OFFERS] });
  }

  const publishOfferMutation = useMutation({
    mutationFn: (dto: PublishServiceOfferDto) => api.professions.publishServiceOffer(dto),
    onSettled: invalidateOffers,
  });

  const removeOfferMutation = useMutation({
    mutationFn: () => api.professions.removeServiceOffer(),
    onSettled: invalidateOffers,
  });

  const user = userStore.user;
  const stats = user?.stats;
  const stamina = stats?.stamina ?? 0;
  const maxStamina = stats?.maxStamina ?? 0;

  // A player practices exactly one profession at a time, so everything else on
  // the list is a swap that would burn the current level.
  const current = user?.professions?.[0];
  const levelByProfessionId: Record<number, number> = {};
  if (current) levelByProfessionId[current.professionId] = current.level;

  const allProfessions = professionsQuery.data ?? [];
  const available = allProfessions.filter((profession) => profession.id !== current?.professionId);

  // Equipped, locked and listed stacks are off limits server side, so they are
  // left out of what the ingredient counters show as spendable.
  const ownedByItemId: Record<number, number> = {};
  (user?.inventory ?? [])
    .filter((item) => !item.equipped && !item.locked && !item.marketListing)
    .forEach((item) => {
      ownedByItemId[item.itemId] = (ownedByItemId[item.itemId] ?? 0) + item.stack;
    });

  const nodes = nodesQuery.data ?? [];
  const recipes = recipesQuery.data ?? [];

  const offers = offersQuery.data ?? [];
  const myOffer = offers.find((offer) => offer.crafterEmail === user?.email);
  // Only crafting trades can be hired, so they are the only filters worth showing.
  const craftingProfessions = allProfessions.filter((profession) => profession.kind === 'crafting');
  const shownOffers = offers.filter((offer) => hireFilter === 'all' || offer.professionId === hireFilter);
  const hiringBusy = publishOfferMutation.isPending || removeOfferMutation.isPending;

  const tabs: TabOption<ProfessionTab>[] = [
    // The badge nudges toward picking a first profession; once one is chosen the
    // rest are swaps, not something to nag about.
    { value: 'professions', label: 'Professions', badge: current ? undefined : available.length },
    { value: 'gather', label: 'Gather' },
    { value: 'craft', label: 'Craft' },
    { value: 'hire', label: 'Hire', badge: offers.length },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.staminaCard}>
        <div className={styles.staminaHeader}>
          <span className={styles.staminaTitle}>Stamina</span>
          <span className={styles.staminaHint}>Refills daily</span>
        </div>
        <StatBar
          variant="stamina"
          percentage={maxStamina ? (stamina / maxStamina) * 100 : 0}
          label={`${stamina} / ${maxStamina}`}
        />
      </section>

      <Tabs options={tabs} selected={showing} onSelect={setShowing} />

      <div className={styles.tabPanel}>
        <When value={showing === 'professions'}>
          <section className={styles.section}>
            <span className={styles.sectionTitle}>Learned</span>
            <When value={!current}>
              <span className={styles.empty}>No profession learned yet</span>
            </When>
            {current && <ProfessionCard profession={current.profession} userProfession={current} />}
          </section>

          <When value={available.length > 0}>
            <section className={styles.section}>
              <span className={styles.sectionTitle}>{current ? 'Swap to' : 'Available'}</span>
              <When value={!!current}>
                <span className={styles.swapHint}>Swapping resets your current profession to level 1</span>
              </When>
              <ForEach
                items={available}
                render={(profession) => (
                  <ProfessionCard
                    key={profession.id}
                    profession={profession}
                    disabled={learnMutation.isPending}
                    actionLabel={current ? 'Swap' : 'Learn'}
                    // Swapping is destructive, so it goes through a confirmation
                    // that spells out what the current profession loses.
                    onLearn={() =>
                      current
                        ? modalStore.setSwapProfession({ open: true, profession })
                        : learnMutation.mutate(profession.id)
                    }
                  />
                )}
              />
            </section>
          </When>
        </When>

        <When value={showing === 'gather'}>
          <When value={nodes.length === 0}>
            <span className={styles.empty}>Nothing to gather yet</span>
          </When>
          <ForEach
            items={nodes}
            render={(node) => (
              <GatheringNodeCard
                key={node.id}
                node={node}
                professionLevel={levelByProfessionId[node.professionId]}
                stamina={stamina}
                busy={gatherMutation.isPending}
                lastResult={gatherResults[node.id]}
                onGather={() => gatherMutation.mutate(node.id)}
              />
            )}
          />
        </When>

        <When value={showing === 'craft'}>
          <When value={recipes.length === 0}>
            <span className={styles.empty}>No recipe available yet</span>
          </When>
          <ForEach
            items={recipes}
            render={(recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                professionLevel={levelByProfessionId[recipe.professionId]}
                stamina={stamina}
                ownedByItemId={ownedByItemId}
                // Crafting goes through the details sheet: what it eats, what
                // it costs and how likely each quality is.
                onCraft={() => modalStore.setCraftDetails({ open: true, recipe })}
              />
            )}
          />
        </When>

        <When value={showing === 'hire'}>
          <section className={styles.section}>
            <span className={styles.sectionTitle}>Your offer</span>
            <ServiceOfferForm
              profession={current?.profession}
              offer={myOffer}
              busy={hiringBusy}
              onPublish={(dto) => publishOfferMutation.mutate(dto)}
              onRemove={() => removeOfferMutation.mutate()}
            />
          </section>

          <section className={styles.section}>
            <span className={styles.sectionTitle}>Crafters for hire</span>
            <span className={styles.swapHint}>You bring the materials and keep the item — they keep the exp</span>
            <ProfessionFilter
              professions={craftingProfessions}
              selected={hireFilter}
              onSelect={(value) => setHireFilter(value)}
            />
            <When value={shownOffers.length === 0}>
              <span className={styles.empty}>
                {offers.length === 0 ? 'Nobody is offering their services' : 'No crafter of that trade is offering'}
              </span>
            </When>
            <ForEach
              items={shownOffers}
              render={(offer) => (
                <HireOfferCard
                  key={offer.id}
                  offer={offer}
                  recipes={recipes.filter((recipe) => recipe.professionId === offer.professionId)}
                  ownedByItemId={ownedByItemId}
                  silver={user?.silver ?? 0}
                  isSelf={offer.crafterEmail === user?.email}
                  onHire={(recipeId) =>
                    modalStore.setCraftDetails({
                      open: true,
                      offer,
                      recipe: recipes.find((r) => r.id === recipeId),
                    })
                  }
                />
              )}
            />
          </section>
        </When>
      </div>
    </div>
  );
}
