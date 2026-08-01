import cn from 'classnames';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Stat } from '@/components/Character/CharacterStatsInfo';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  guild?: Guild;
  onRequestClose: () => void;
};

/** Guild capacity and the stat granted per blessing level, both server rules. */
const MAX_MEMBERS = 10;
const BLESSING_MULTIPLIER = 5;

/** Owner first, then officers, then whoever contributes most. */
const ROLE_ORDER: Record<string, number> = { owner: 0, officer: 1, member: 2 };

export function GuildInfoModal({ guild, isOpen, onRequestClose }: Props) {
  const modalStore = useModalStore();
  const userStore = useUserStore();

  const members = [...(guild?.members ?? [])].sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9) || b.contribution - a.contribution,
  );

  const experience = guild?.experience ?? 0;
  const level = guild?.level ?? 1;
  // Levels come from total experience, so the bar has to back out the levels
  // already paid for to show progress inside the current one.
  const expForCurrentLevel = Array.from({ length: level - 1 }, (_, index) => (index + 1) * 100).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  const expIntoLevel = Math.max(experience - expForCurrentLevel, 0);
  const expForNextLevel = level * 100;
  const levelProgress = Math.min((expIntoLevel / expForNextLevel) * 100, 100);

  const blessing = guild?.blessing;
  const task = guild?.currentGuildTask;
  const taskProgress = task ? ((task.task.killCount - task.remainingKills) / task.task.killCount) * 100 : 0;

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <header className={styles.header}>
        <img className={styles.emblem} src={guild?.imageUrl} alt={guild?.name} />
        <div className={styles.identity}>
          <h2 className={styles.name}>{guild?.name}</h2>
          <span className={styles.subtitle}>
            Lv {level} · {members.length}/{MAX_MEMBERS} members
          </span>
          <div className={styles.expBar}>
            <div className={styles.expFill} style={{ width: `${levelProgress}%` }} />
          </div>
          <span className={styles.expLabel}>
            {expIntoLevel} / {expForNextLevel} exp
          </span>
        </div>
      </header>

      <When value={!!guild?.publicMessage}>
        <p className={styles.motto}>{guild?.publicMessage}</p>
      </When>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Blessings</span>
          <span className={styles.sectionHint}>+{BLESSING_MULTIPLIER} per blessing level</span>
        </div>
        <When value={!blessing}>
          <span className={styles.empty}>This guild has unlocked no blessings</span>
        </When>
        <When value={!!blessing}>
          {/* What every member gets for being here. */}
          <div className={styles.blessings}>
            <Stat assetName="health" label="HP" value={(blessing?.health ?? 0) * BLESSING_MULTIPLIER} />
            <Stat assetName="mana" label="MP" value={(blessing?.mana ?? 0) * BLESSING_MULTIPLIER} />
            <Stat assetName="str" label="STR" value={(blessing?.str ?? 0) * BLESSING_MULTIPLIER} />
            <Stat assetName="agi" label="AGI" value={(blessing?.agi ?? 0) * BLESSING_MULTIPLIER} />
            <Stat assetName="int" label="INT" value={(blessing?.int ?? 0) * BLESSING_MULTIPLIER} />
          </div>
        </When>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Current task</span>
          <span className={styles.soulshards}>{guild?.taskPoints ?? 0} soulshards</span>
        </div>
        <When value={!task}>
          <span className={styles.empty}>No task running</span>
        </When>
        <When value={!!task}>
          <div className={styles.task}>
            <div className={styles.taskHeader}>
              <span className={styles.taskName}>{task?.task.name}</span>
              <span className={styles.taskReward}>+{task?.task.taskPoints}</span>
            </div>
            <span className={styles.taskTarget}>on {task?.task.target?.name}</span>
            <div className={styles.taskBar}>
              <div className={styles.taskFill} style={{ width: `${taskProgress}%` }} />
            </div>
            <span className={styles.taskProgress}>
              {(task?.task.killCount ?? 0) - (task?.remainingKills ?? 0)} / {task?.task.killCount} kills
            </span>
          </div>
        </When>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Members</span>
        <ForEach
          items={members}
          render={(member) => {
            const isSelf = member.userEmail === userStore.user?.email;

            return (
              // Opens the player profile in place of this sheet — the same one
              // the ranking uses.
              <button
                key={member.id}
                type="button"
                className={cn(styles.memberRow, { [styles.self]: isSelf })}
                onClick={() => {
                  onRequestClose();
                  modalStore.setInteractUser({ open: true, user: member.user });
                }}
              >
                <div className={styles.memberText}>
                  <div className={styles.memberNameRow}>
                    <span className={styles.memberName}>{member.user?.name}</span>
                    <span className={cn(styles.roleBadge, styles[member.role])}>{member.role}</span>
                  </div>
                  <span className={styles.memberMeta}>
                    Lv {member.user?.stats?.level ?? 1}
                    {member.user?.class?.name ? ` · ${member.user.class.name}` : ''}
                  </span>
                </div>
                <div className={styles.memberStats}>
                  <span className={styles.contribution}>{member.contribution}</span>
                  <span className={styles.contributionLabel}>contribution</span>
                </div>
              </button>
            );
          }}
        />
      </section>
    </BaseModal>
  );
}
