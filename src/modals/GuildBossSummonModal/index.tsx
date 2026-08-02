import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import cn from 'classnames';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { LoadingBlock } from '@/components/shared/LoadingBlock';
import { GuildToken } from '@/components/StatsComponents/GuildToken';
import { useWebsocketApi } from '@/api/websocketServer';
import { Query } from '@/store/query';
import { useUserStore } from '@/store/user';
import { GUILD_BOSS_DIFFICULTIES } from '@/pages/guild/guildBoss';

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

/**
 * Mirrors the server's difficulty table (guildBoss.rules) so the numbers can be
 * shown before committing the guild to them. Health climbs faster than the
 * reward on purpose.
 */
const MODIFIERS: Record<GuildBossDifficulty, { health: number; reward: number }> = {
  easy: { health: 1, reward: 1 },
  normal: { health: 3, reward: 2.5 },
  hard: { health: 9, reward: 6 },
  nightmare: { health: 25, reward: 14 },
};

export function GuildBossSummonModal({ isOpen, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const [difficulty, setDifficulty] = useState<GuildBossDifficulty>('easy');

  const bossesQuery = useQuery({
    queryKey: [Query.GUILD_BOSSES],
    staleTime: Infinity,
    queryFn: () => api.guild.getGuildBosses(),
  });

  const summonMutation = useMutation({
    mutationFn: (bossId: number) => api.guild.summonGuildBoss({ bossId, difficulty }),
    onSuccess: () => onRequestClose(),
  });

  const guildLevel = userStore.guild?.level ?? 1;
  const bosses = bossesQuery.data ?? [];
  const modifier = MODIFIERS[difficulty];

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>Summon a boss</h2>
        <span className={styles.subtitle}>
          It stays until the guild kills it. Everyone gets one entry a day to chip at its health.
        </span>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Difficulty</span>
        <div className={styles.difficulties}>
          {GUILD_BOSS_DIFFICULTIES.map((option) => (
            <button
              key={option}
              onClick={() => setDifficulty(option)}
              className={cn(styles.difficulty, styles[option], { [styles.selected]: option === difficulty })}
            >
              {option}
            </button>
          ))}
        </div>
        <span className={styles.modifierNote}>
          ×{modifier.health} health, ×{modifier.reward} rewards
        </span>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Boss</span>
        <When value={bossesQuery.isLoading}>
          <LoadingBlock info="Loading bosses" />
        </When>
        <When value={!bossesQuery.isLoading && bosses.length === 0}>
          <span className={styles.empty}>No bosses are available yet.</span>
        </When>

        <div className={styles.list}>
          <ForEach
            items={bosses}
            render={(boss) => {
              const locked = guildLevel < boss.requiredGuildLevel;
              return (
                <div className={cn(styles.boss, { [styles.locked]: locked })} key={boss.id}>
                  <img className={styles.portrait} src={boss.image} alt={boss.name} />
                  <div className={styles.bossInfo}>
                    <span className={styles.bossName}>{boss.name}</span>
                    <span className={styles.bossStats}>
                      {Math.floor(boss.health * modifier.health).toLocaleString()} HP · Lv {boss.level}
                    </span>
                    <div className={styles.bossRewards}>
                      <span className={styles.shards}>
                        <img width={12} height={12} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=12&h=12" />
                        {Math.floor(boss.taskPoints * modifier.reward)}
                      </span>
                      <GuildToken amount={Math.floor(boss.tokens * modifier.reward)} size={12} />
                    </div>
                  </div>
                  <Button
                    className={styles.summon}
                    theme={locked ? 'neutral' : 'danger'}
                    disabled={locked || summonMutation.isPending}
                    label={locked ? `Guild Lv ${boss.requiredGuildLevel}` : 'Summon'}
                    onClick={() => summonMutation.mutate(boss.id)}
                  />
                </div>
              );
            }}
          />
        </div>
      </section>
    </BaseModal>
  );
}
