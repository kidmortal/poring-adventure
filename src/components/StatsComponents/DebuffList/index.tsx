import ForEach from '../../shared/ForEach';
import styles from './style.module.scss';

type Props = {
  debuffs?: BattleDebuff[];
};

/**
 * What is stuck on a combatant, with the turns it has left on the corner of the
 * icon — a shred expiring next turn and one that lasts three more are different
 * plays, and the icon alone does not say which it is.
 *
 * The monster side of the fight has drawn these all along; this is the same row
 * for a player, now that a player can carry them too.
 */
export default function DebuffList(props: Props) {
  if (!props.debuffs?.length) return <></>;

  return (
    <div className={styles.container}>
      <ForEach
        items={props.debuffs}
        render={(debuff, index) => (
          <div key={`${debuff.name}-${index}`} className={styles.debuff} title={debuff.name}>
            <img width={18} height={18} src={debuff.image} alt={debuff.name} />
            <span className={styles.duration}>{debuff.duration}</span>
          </div>
        )}
      />
    </div>
  );
}
