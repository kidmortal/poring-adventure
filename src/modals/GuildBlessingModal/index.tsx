import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/shared/Button';
import { useUserStore } from '@/store/user';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

/** Soulshards charged per upgrade, and to unlock blessings in the first place. */
const UPGRADE_COST = 100;
const UNLOCK_COST = 100;

type BlessingConfig = {
  name: string;
  alias: string;
  src: string;
  value?: number;
  /** Stat granted per blessing level. */
  multiplier: number;
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

  const blessings: BlessingConfig[] = [
    { name: 'Health', alias: 'health', src: 'blessing_health', value: blessing?.health, multiplier: 5 },
    { name: 'Mana', alias: 'mana', src: 'blessing_mana', value: blessing?.mana, multiplier: 5 },
    { name: 'Strength', alias: 'str', src: 'blessing_str', value: blessing?.str, multiplier: 1 },
    { name: 'Agility', alias: 'agi', src: 'blessing_agi', value: blessing?.agi, multiplier: 1 },
    { name: 'Intelligence', alias: 'int', src: 'blessing_int', value: blessing?.int, multiplier: 1 },
  ];

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
          {blessings.map((config) => (
            <Blessing key={config.alias} config={config} soulshards={soulshards} />
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

function Blessing({ config, soulshards }: { config: BlessingConfig; soulshards: number }) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const guild = userStore.guild;

  const upgradeBlessMutation = useMutation({
    mutationFn: () => api.guild.upgradeBlessing({ guildId: guild?.id ?? 0, blessing: config.alias }),
  });

  const value = config.value ?? 0;
  const level = Math.floor(value / config.multiplier);
  const canAfford = soulshards >= UPGRADE_COST;

  return (
    <div className={styles.blessingContainer}>
      <img className={styles.blessingIcon} src={`https://kidmortal.sirv.com/misc/${config.src}.png`} alt={config.name} />

      <div className={styles.blessingInfo}>
        <span className={styles.blessingName}>{config.name}</span>
        <div className={styles.blessingMeta}>
          <span className={styles.level}>Lv {level}</span>
          <span className={styles.bonus}>+{value}</span>
          <span className={styles.nextLevel}>→ +{value + config.multiplier}</span>
        </div>
      </div>

      <Button
        className={styles.upgradeButton}
        theme={canAfford ? 'primary' : 'neutral'}
        label={
          <>
            <span>{UPGRADE_COST}</span>
            <img width={16} height={16} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          </>
        }
        onClick={() => upgradeBlessMutation.mutate()}
        disabled={!canAfford || upgradeBlessMutation.isPending}
      />
    </div>
  );
}
