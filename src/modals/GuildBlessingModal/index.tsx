import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user';
import { When } from '@/components/When';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';

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

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <When value={!!blessing}>
        <div className={styles.container}>
          <Blessing
            name="Health"
            alias="health"
            src="https://kidmortal.sirv.com/misc/blessing_health.png"
            value={blessing?.health}
            multiplier={5}
          />
          <Blessing
            name="Mana"
            alias="mana"
            src="https://kidmortal.sirv.com/misc/blessing_mana.png"
            value={blessing?.mana}
            multiplier={5}
          />
          <Blessing
            name="Strength"
            alias="str"
            src="https://kidmortal.sirv.com/misc/blessing_str.png"
            value={blessing?.str}
          />
          <Blessing
            name="Agility"
            alias="agi"
            src="https://kidmortal.sirv.com/misc/blessing_agi.png"
            value={blessing?.agi}
          />
          <Blessing
            name="Intelligence"
            alias="int"
            src="https://kidmortal.sirv.com/misc/blessing_int.png"
            value={blessing?.int}
          />
        </div>
      </When>
      <When value={!guild?.blessing}>
        <div className={styles.noBlessingsContainer}>
          <Button
            label={
              <div>
                <span>Unlock blessings</span>
                <span>100</span>
                <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
              </div>
            }
            onClick={() => unlockBlessingsMutation.mutate()}
            disabled={unlockBlessingsMutation.isPending}
          />
        </div>
      </When>
    </BaseModal>
  );
}

function Blessing({
  name,
  alias,
  src,
  value = 0,
  multiplier = 1,
}: {
  name: string;
  alias: string;
  src: string;
  value?: number;
  multiplier?: number;
}) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const guild = userStore.guild;
  const level = Math.floor(value / multiplier);
  const upgradeCost = 100;
  const upgradeBlessMutation = useMutation({
    mutationFn: () => api.guild.upgradeBlessing({ guildId: guild?.id ?? 0, blessing: alias }),
  });
  return (
    <div className={styles.blessingContainer}>
      <div className={styles.row}>
        <strong>Lv {level}</strong>
        <img src={src} />
      </div>
      <p>
        {name} (+{multiplier * level})
      </p>

      <Button
        label={
          <div className={styles.updateButtonContainer}>
            <span>{upgradeCost}</span>
            <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          </div>
        }
        onClick={() => upgradeBlessMutation.mutate()}
        disabled={(guild?.taskPoints ?? 0) < upgradeCost || upgradeBlessMutation.isPending}
      />
    </div>
  );
}
