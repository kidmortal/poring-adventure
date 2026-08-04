import ForEach from '../../shared/ForEach';
import { When } from '../../shared/When';
import styles from './style.module.scss';

type Props = {
  buffs?: UserBuff[];
};

export default function BuffList(props: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={props.buffs}
        render={({ buff, barrier }) => (
          <div key={buff.id} className={styles.buff} title={buff.name}>
            <img width={25} height={25} src={buff.image} />
            {/* A barrier is only worth what is left in it, so the number is the
                buff: the icon alone still reads as "protected" long after the
                pool has been spent down to nothing. */}
            <When value={barrier !== undefined}>
              <span className={styles.barrier}>{barrier}</span>
            </When>
          </div>
        )}
      />
    </div>
  );
}
