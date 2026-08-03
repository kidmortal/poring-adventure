import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaCrown, FaGift, FaUserPlus, FaUserSlash } from 'react-icons/fa';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Stat } from '@/components/Character/CharacterStatsInfo';
import ExperienceBar from '@/components/StatsComponents/ExperienceBar';
import HealthBar from '@/components/StatsComponents/HealthBar';
import ManaBar from '@/components/StatsComponents/ManaBar';
import { GuildToken } from '@/components/StatsComponents/GuildToken';
import { useWebsocketApi } from '@/api/websocketServer';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import { hasBossEntryToday } from '@/pages/guild/guildBoss';

type Props = {
  isOpen?: boolean;
  member?: GuildMember;
  onRequestClose: () => void;
};

/** One guild member up close: the character they play and what they bring to the guild. */
export function GuildMemberModal({ isOpen, member, onRequestClose }: Props) {
  const userStore = useUserStore();
  const modalStore = useModalStore();
  const api = useWebsocketApi();
  const [confirmingKick, setConfirmingKick] = useState(false);

  const guild = userStore.guild;
  const user = member?.user;
  const stats = user?.stats;
  const isLeader = !!member && guild?.leaderEmail === member.userEmail;

  const close = () => {
    setConfirmingKick(false);
    onRequestClose();
  };

  const inviteMutation = useMutation({
    mutationFn: () =>
      api.party.inviteToParty({ invitedEmail: member?.userEmail ?? '', partyId: userStore.user?.partyId ?? 0 }),
    onSuccess: () => close(),
  });

  const kickMutation = useMutation({
    mutationFn: () => api.guild.kickFromGuild({ guildId: guild?.id ?? 0, userEmail: member?.userEmail ?? '' }),
    onSuccess: () => close(),
  });

  const isSelf = member?.userEmail === userStore.user?.email;
  const youLead = !!guild && guild.leaderEmail === userStore.user?.email;
  const busy = inviteMutation.isPending || kickMutation.isPending;

  let inviteBlockedReason: string | undefined;
  if (isSelf) inviteBlockedReason = 'This is you';
  else if (!userStore.user?.partyId) inviteBlockedReason = 'Create a party first';
  else if (user?.partyId === userStore.user?.partyId) inviteBlockedReason = 'Already in your party';



  return (
    <BaseModal isOpen={isOpen} onRequestClose={close}>
      <header className={styles.header}>
        <div className={styles.portrait}>
          <CharacterInfo
            costume={user?.appearance?.costume ?? ''}
            gender={user?.appearance?.gender ?? 'male'}
            head={user?.appearance?.head ?? '1'}
          />
        </div>
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{user?.name}</h2>
            <When value={isLeader}>
              <span className={styles.leaderBadge}>
                <FaCrown /> leader
              </span>
            </When>
          </div>
          <span className={styles.subtitle}>
            {user?.class?.name ?? 'No class'} · Lv {stats?.level ?? 1}
          </span>
          <HealthBar currentHealth={stats?.health ?? 0} maxHealth={stats?.maxHealth ?? 0} minHeight="0.4rem" />
          <ManaBar currentHealth={stats?.mana ?? 0} maxHealth={stats?.maxMana ?? 0} minHeight="0.4rem" />
          <ExperienceBar currentExp={stats?.experience} level={stats?.level} minHeight="0.4rem" />
        </div>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Character</span>
        <div className={styles.stats}>
          <Stat assetName="attack" label="ATK" value={stats?.attack} />
          <Stat assetName="str" label="STR" value={stats?.str} />
          <Stat assetName="agi" label="AGI" value={stats?.agi} />
          <Stat assetName="int" label="INT" value={stats?.int} />
          <Stat assetName="health" label="HP" value={stats?.maxHealth} />
          <Stat assetName="mana" label="MP" value={stats?.maxMana} />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Guild</span>
        <div className={styles.rows}>
          <Row label="Rank" value={member?.role ?? '-'} />
          <div className={styles.row}>
            <span className={styles.rowLabel}>Guild tokens</span>
            <GuildToken amount={member?.guildTokens} size={14} />
          </div>
          <Row label="Boss entry" value={hasBossEntryToday(member) ? 'Ready' : 'Used today'} />
        </div>
      </section>

      {/* Confirming replaces the actions instead of stacking a modal — BaseModal
          closes on any click outside its own box, so a second one on top of this
          would dismiss the member behind it. */}
      <When value={confirmingKick}>
        <div className={styles.actions}>
          <span className={styles.confirmMessage}>Kick {user?.name} out of the guild?</span>
          <Button
            theme="danger"
            label="Confirm kick"
            disabled={kickMutation.isPending}
            onClick={() => kickMutation.mutate()}
          />
          <Button
            theme="neutral"
            label="Cancel"
            disabled={kickMutation.isPending}
            onClick={() => setConfirmingKick(false)}
          />
        </div>
      </When>

      <When value={!confirmingKick}>
        <div className={styles.actions}>
          <Button
            label={
              <span className={styles.actionLabel}>
                <FaUserPlus />
                {inviteBlockedReason ?? 'Invite to party'}
              </span>
            }
            theme={inviteBlockedReason ? 'neutral' : 'primary'}
            disabled={!!inviteBlockedReason || busy}
            onClick={() => inviteMutation.mutate()}
          />
          {/* Gifting has none of the invite's preconditions — you only need
              something to give, which the gift modal itself checks. */}
          <Button
            theme={isSelf ? 'neutral' : 'gold'}
            disabled={isSelf}
            label={
              <span className={styles.actionLabel}>
                <FaGift />
                {isSelf ? 'This is you' : 'Send a gift'}
              </span>
            }
            onClick={() => {
              close();
              modalStore.setGift({ open: true, user });
            }}
          />
          <When value={youLead && !isSelf}>
            <Button
              theme="danger"
              disabled={busy}
              label={
                <span className={styles.actionLabel}>
                  <FaUserSlash />
                  Kick from guild
                </span>
              }
              onClick={() => setConfirmingKick(true)}
            />
          </When>
        </div>
      </When>
    </BaseModal>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
