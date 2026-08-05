import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { useUserStore } from '@/store/user';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';
import {
  BLESSINGS,
  BlessingConfig,
  MAX_BLESSING_LEVEL,
  UNLOCK_COST,
  blessingLevel,
  blessingUpgradeCost,
} from './blessings';

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

export function GuildBlessingModal({ isOpen, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const guild = userStore.guild;

  const unlockBlessingsMutation = useMutation({
    mutationFn: () => api.guild.unlockBlessing({ guildId: guild?.id ?? 0 }),
  });

  const blessing = guild?.blessing;
  const soulshards = guild?.taskPoints ?? 0;

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <header className={styles.header}>
        <div>
          <h2>Guild blessings</h2>
          <span className={styles.subtitle}>Passive bonuses for every member</span>
        </div>
        <div className={styles.balance} title="Guild soulshards">
          <img width={18} height={18} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{soulshards}</span>
        </div>
      </header>

      {blessing ? (
        <div className={styles.container}>
          {BLESSINGS.map((config) => (
            <Blessing key={config.alias} config={config} value={blessing[config.alias] ?? 0} soulshards={soulshards} />
          ))}
        </div>
      ) : (
        <div className={styles.noBlessingsContainer}>
          <p className={styles.lockedMessage}>
            Blessings are locked. Unlock them to grant every member permanent stat bonuses.
          </p>
          <Button
            label={
              <>
                <span>Unlock for {UNLOCK_COST}</span>
                <img width={18} height={18} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
              </>
            }
            onClick={() => unlockBlessingsMutation.mutate()}
            disabled={unlockBlessingsMutation.isPending || soulshards < UNLOCK_COST}
          />
          {soulshards < UNLOCK_COST && (
            <span className={styles.warning}>Your guild needs {UNLOCK_COST - soulshards} more soulshards.</span>
          )}
        </div>
      )}
    </BaseModal>
  );
}

function Blessing({ config, value, soulshards }: { config: BlessingConfig; value: number; soulshards: number }) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const guild = userStore.guild;

  const upgradeBlessMutation = useMutation({
    mutationFn: () => api.guild.upgradeBlessing({ guildId: guild?.id ?? 0, blessing: config.alias }),
  });

  const level = blessingLevel(value, config.multiplier);
  const maxed = level >= MAX_BLESSING_LEVEL;
  // The cost climbs with the level, so it is read per blessing, not per shelf.
  const cost = blessingUpgradeCost(level);
  const canAfford = soulshards >= cost;

  return (
    <div className={styles.blessingContainer}>
      <img
        className={styles.blessingIcon}
        src={`https://kidmortal.sirv.com/misc/${config.src}.webp`}
        alt={config.name}
      />

      <div className={styles.blessingInfo}>
        <span className={styles.blessingName}>{config.name}</span>
        <div className={styles.blessingMeta}>
          <span className={styles.level}>Lv {level}</span>
          <span className={styles.bonus}>+{value}</span>
          {!maxed && <span className={styles.nextLevel}>→ +{value + config.multiplier}</span>}
        </div>
      </div>

      <Button
        className={styles.upgradeButton}
        theme={canAfford && !maxed ? 'primary' : 'neutral'}
        label={
          maxed ? (
            <span>Max</span>
          ) : (
            <>
              <span>{cost}</span>
              <img width={16} height={16} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
            </>
          )
        }
        onClick={() => upgradeBlessMutation.mutate()}
        disabled={maxed || !canAfford || upgradeBlessMutation.isPending}
      />
    </div>
  );
}
