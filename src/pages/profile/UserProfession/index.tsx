import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

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

type ProfessionTab = 'professions' | 'gather' | 'craft';

/**
 * Crafting and gathering. Every action here is priced in stamina, which refills
 * once a day, so the whole page is built around that budget.
 */
export function UserProfession() {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const modalStore = useModalStore();
  const [showing, setShowing] = useState<ProfessionTab>('professions');
  const [gatherResults, setGatherResults] = useState<Record<number, GatherResult>>({});
  const [craftResults, setCraftResults] = useState<Record<number, CraftResult>>({});

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

  const craftMutation = useMutation({
    mutationFn: (recipeId: number) => api.professions.craft({ recipeId }),
    onSuccess: (result, recipeId) => {
      if (result) setCraftResults((current) => ({ ...current, [recipeId]: result }));
    },
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

  const tabs: TabOption<ProfessionTab>[] = [
    // The badge nudges toward picking a first profession; once one is chosen the
    // rest are swaps, not something to nag about.
    { value: 'professions', label: 'Professions', badge: current ? undefined : available.length },
    { value: 'gather', label: 'Gather' },
    { value: 'craft', label: 'Craft' },
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
                busy={craftMutation.isPending}
                lastResult={craftResults[recipe.id]}
                onCraft={() => craftMutation.mutate(recipe.id)}
              />
            )}
          />
        </When>
      </div>
    </div>
  );
}
