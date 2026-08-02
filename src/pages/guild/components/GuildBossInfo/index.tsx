import { useMutation } from '@tanstack/react-query';
import cn from 'classnames';
import { FaCrown, FaSkull, FaUsers } from 'react-icons/fa';

import styles from './style.module.scss';
import { useWebsocketApi } from '@/api/websocketServer';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { GuildToken } from '@/components/StatsComponents/GuildToken';
import { CharacterHead } from '@/components/Character/CharacterInfo';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import { bossEntryBlockers, contributionShare, groupDamageByParty, hasBossEntryToday } from '../../guildBoss';

/**
 * The standing boss: one health pool the whole guild wears down, a member's
 * banked damage deciding their cut of the tokens when it finally drops.
 */
export function GuildBossInfo({ guild, boss }: { guild?: Guild; boss?: CurrentGuildBoss }) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const userStore = useUserStore();

  const fightMutation = useMutation({
    mutationFn: () => api.battle.createGuildBossBattle(),
  });
  const dismissMutation = useMutation({
    mutationFn: () => api.guild.dismissGuildBoss(),
  });

  const member = userStore.user?.guildMember;
  const canManage = (member?.permissionLevel ?? 0) >= 2;

  if (!boss) {
    return (
      <div className={styles.empty}>
        <FaSkull className={styles.emptyIcon} />
        <span className={styles.emptyTitle}>No boss standing</span>
        <span className={styles.emptyHint}>
          {canManage
            ? 'Summon one and the whole guild can chip at it, an entry a day each.'
            : 'An officer has to summon one before the guild can fight.'}
        </span>
        <When value={canManage}>
          <Button label="Summon a boss" onClick={() => modalStore.setGuildBossSummon({ open: true })} />
        </When>
      </div>
    );
  }

  const damages = [...(boss.damage ?? [])].sort((a, b) => b.damage - a.damage);
  const groups = groupDamageByParty(damages);
  const totalDealt = boss.maxHealth - boss.health;
  // What you and whoever you fought with have taken off the boss, measured
  // against the whole pool — the party banks as one, so it reads as one.
  const yourGroup = groups.find((group) => group.entries.some((e) => e.userEmail === userStore.user?.email));
  const yourDamage = yourGroup?.score ?? 0;
  const yourShare = boss.maxHealth > 0 ? Math.round((yourDamage / boss.maxHealth) * 100) : 0;
  const foughtInParty = (yourGroup?.entries.length ?? 0) > 1;
  const healthPercent = Math.max(0, Math.min(100, (boss.health / boss.maxHealth) * 100));
  // Read from the guild payload, not the profile: that is what gets re-pushed
  // the moment entries are spent, so the badge cannot disagree with the list
  // of who is holding the fight up.
  const myMembership = (guild?.members ?? []).find((m) => m.userEmail === userStore.user?.email) ?? member;
  const hasEntry = hasBossEntryToday(myMembership);
  // A party fights as one, so anyone in it can hold the whole fight up.
  const partyMembers = userStore.party?.members ?? [];
  const participants = partyMembers.length > 0 ? partyMembers : [userStore.user].filter(Boolean);
  const blockers = bossEntryBlockers({ participants: participants as User[], guild });
  const memberByEmail = new Map((guild?.members ?? []).map((m) => [m.userEmail, m]));

  // The guild payload knows the members; the damage row carries its own user for
  // anyone who has since left.
  const nameFor = (entry: GuildBossDamage) =>
    memberByEmail.get(entry.userEmail)?.user?.name ?? entry.user?.name ?? entry.userEmail;
  const avatarFor = (entry: GuildBossDamage) => {
    const appearance = memberByEmail.get(entry.userEmail)?.user?.appearance ?? entry.user?.appearance;
    return (
      <CharacterHead
        className={styles.avatar}
        head={appearance?.head ?? '1'}
        gender={appearance?.gender ?? 'male'}
      />
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img className={styles.portrait} src={boss.boss.image} alt={boss.boss.name} />
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{boss.boss.name}</h3>
            <span className={cn(styles.difficulty, styles[boss.difficulty])}>{boss.difficulty}</span>
          </div>
          <span className={styles.level}>Lv {boss.boss.level}</span>
        </div>
      </header>

      <div className={styles.healthBar}>
        <div className={styles.healthFill} style={{ width: `${healthPercent}%` }} />
        <span className={styles.healthLabel}>
          {boss.health.toLocaleString()} / {boss.maxHealth.toLocaleString()}
        </span>
      </div>

      <div className={styles.yourRow}>
        <span className={styles.yourDamage}>
          {foughtInParty ? 'Your party damage' : 'Your damage'} <strong>{yourDamage.toLocaleString()}</strong> (
          {yourShare}%)
        </span>
        <span className={cn(styles.entry, { [styles.entrySpent]: !hasEntry })}>
          {hasEntry ? 'Entry ready' : 'Entry used today'}
        </span>
      </div>

      <Button
        theme={blockers.length === 0 ? 'danger' : 'neutral'}
        disabled={blockers.length > 0 || fightMutation.isPending}
        label="Fight the boss"
        onClick={() => fightMutation.mutate()}
      />

      {/* Whoever is standing in the way, and why — the server would only say it
          one at a time, and only after the attempt. */}
      <When value={blockers.length > 0}>
        <div className={styles.blockers}>
          {blockers.map((blocker) => (
            <div className={styles.blocker} key={blocker.email}>
              <CharacterHead
                className={styles.blockerAvatar}
                head={blocker.appearance?.head ?? '1'}
                gender={blocker.appearance?.gender ?? 'male'}
              />
              <span>
                <strong>{blocker.name}</strong> {blocker.reason}
              </span>
            </div>
          ))}
        </div>
      </When>

      {/* The fight spends everyone's entry, so it should not be a surprise. */}
      <When value={blockers.length === 0 && !!userStore.user?.partyId}>
        <span className={styles.partyWarning}>Fighting in a party spends the entry of every member.</span>
      </When>

      <section className={styles.damageSection}>
        <span className={styles.sectionTitle}>Damage banked</span>
        <When value={damages.length === 0}>
          <span className={styles.emptyHint}>Nobody has landed a hit yet.</span>
        </When>
        <div className={styles.damageList}>
          <ForEach
            items={groups}
            render={(group) => {
              const inParty = !!group.partyKey && group.entries.length > 1;
              // The leader heads the group; failing that, whoever hit hardest.
              const head =
                group.entries.find((entry) => entry.userEmail === group.leaderEmail) ?? group.entries[0];
              const groupShare = totalDealt > 0 ? Math.round((group.score / totalDealt) * 100) : 0;

              return (
                <div key={group.partyKey ?? group.entries[0].id} className={styles.damageGroup}>
                  {/* One line for the score, whoever earned it. */}
                  <div className={cn(styles.damageRow, { [styles.groupHead]: inParty })}>
                    <div className={styles.headAvatar}>
                      {avatarFor(head)}
                      <When value={inParty}>
                        <span className={styles.leaderMark}>
                          <FaCrown />
                        </span>
                      </When>
                    </div>
                    <span className={styles.damageName}>
                      {nameFor(head)}
                      <When value={inParty}>
                        <span className={styles.partyTag}>
                          <FaUsers /> {group.entries.length}
                        </span>
                      </When>
                    </span>
                    <span className={styles.damageValue}>{group.score.toLocaleString()}</span>
                    <span className={styles.damageShare}>{groupShare}%</span>
                  </div>

                  {/* Who did what inside it. The share is damage dealt, not the
                      evenly split score, so it says who carried the fight. */}
                  <When value={inParty}>
                    <div className={styles.members}>
                      {group.entries.map((entry) => (
                        <div className={cn(styles.damageRow, styles.memberRow)} key={entry.id}>
                          {avatarFor(entry)}
                          <span className={styles.damageName}>{nameFor(entry)}</span>
                          <span className={styles.memberValue}>{(entry.dealtDamage ?? 0).toLocaleString()}</span>
                          <span className={styles.damageShare}>{contributionShare(entry, group)}%</span>
                        </div>
                      ))}
                    </div>
                  </When>
                </div>
              );
            }}
          />
        </div>
      </section>

      <section className={styles.rewardSection}>
        <span className={styles.sectionTitle}>On the kill</span>
        <div className={styles.rewards}>
          <span className={styles.reward}>
            <img width={16} height={16} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=16&h=16" />
            {boss.reward.taskPoints} to the guild
          </span>
          <GuildToken className={styles.reward} amount={boss.reward.tokens} size={14} />
          <span className={styles.rewardNote}>tokens split by damage dealt</span>
        </div>
      </section>

      <When value={canManage}>
        <Button
          theme="neutral"
          className={styles.dismiss}
          disabled={dismissMutation.isPending}
          label="Dismiss boss"
          onClick={() => dismissMutation.mutate()}
        />
        <span className={styles.dismissHint}>Dismissing loses the health pool and everyone's banked damage.</span>
      </When>
    </div>
  );
}
