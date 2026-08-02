import { useMutation } from '@tanstack/react-query';
import { FaCrown, FaUserSlash } from 'react-icons/fa';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Stat } from '@/components/Character/CharacterStatsInfo';
import HealthBar from '@/components/StatsComponents/HealthBar';
import ManaBar from '@/components/StatsComponents/ManaBar';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  member?: User;
  onRequestClose: () => void;
};

/**
 * One party member up close: what they bring to a fight, and — for the leader —
 * the two things that can be done about it.
 */
export function PartyMemberModal({ isOpen, member, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();

  const party = userStore.party;
  const partyId = party?.id ?? 0;

  const promoteMutation = useMutation({
    mutationFn: () => api.party.promoteMember({ partyId, promotedEmail: member?.email ?? '' }),
    onSuccess: () => onRequestClose(),
  });

  const kickMutation = useMutation({
    mutationFn: () => api.party.kickFromParty({ partyId, kickedEmail: member?.email ?? '' }),
    onSuccess: () => onRequestClose(),
  });

  const stats = member?.stats;
  const youLead = party?.leaderEmail === userStore.user?.email;
  const isSelf = member?.email === userStore.user?.email;
  const memberLeads = party?.leaderEmail === member?.email;
  // The leader can act on anyone but themselves.
  const canManage = youLead && !isSelf;
  const busy = promoteMutation.isPending || kickMutation.isPending;

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <div className={styles.portrait}>
          <CharacterInfo
            costume={member?.appearance?.costume ?? ''}
            gender={member?.appearance?.gender ?? 'male'}
            head={member?.appearance?.head ?? '1'}
          />
        </div>
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{member?.name}</h2>
            <When value={memberLeads}>
              <span className={styles.leaderBadge}>
                <FaCrown /> leader
              </span>
            </When>
          </div>
          <span className={styles.subtitle}>
            {member?.class?.name ?? 'No class'} · Lv {stats?.level ?? 1}
          </span>
          <HealthBar currentHealth={stats?.health ?? 0} maxHealth={stats?.maxHealth ?? 0} minHeight="0.4rem" />
          <ManaBar currentHealth={stats?.mana ?? 0} maxHealth={stats?.maxMana ?? 0} minHeight="0.4rem" />
        </div>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Stats</span>
        <div className={styles.stats}>
          <Stat assetName="attack" label="ATK" value={stats?.attack} />
          <Stat assetName="str" label="STR" value={stats?.str} />
          <Stat assetName="agi" label="AGI" value={stats?.agi} />
          <Stat assetName="int" label="INT" value={stats?.int} />
          <Stat assetName="health" label="HP" value={stats?.maxHealth} />
          <Stat assetName="mana" label="MP" value={stats?.maxMana} />
        </div>
      </section>

      <When value={canManage}>
        <div className={styles.actions}>
          <Button
            label={
              <span className={styles.actionLabel}>
                <FaCrown /> Make leader
              </span>
            }
            theme="gold"
            disabled={busy}
            onClick={() => promoteMutation.mutate()}
          />
          <Button
            label={
              <span className={styles.actionLabel}>
                <FaUserSlash /> Kick from party
              </span>
            }
            theme="danger"
            disabled={busy}
            onClick={() => kickMutation.mutate()}
          />
        </div>
      </When>

      <When value={!canManage}>
        <span className={styles.note}>
          {isSelf ? 'This is you' : 'Only the party leader can promote or kick members'}
        </span>
      </When>
    </BaseModal>
  );
}
