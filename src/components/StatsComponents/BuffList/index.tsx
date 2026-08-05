import ForEach from '../../shared/ForEach';
import { When } from '../../shared/When';
import styles from './style.module.scss';
import { durationUnit } from './describe';
import { useModalStore } from '@/store/modal';

type Props = {
  buffs?: UserBuff[];
};

/**
 * What is riding on a character, on their sheet.
 *
 * Every icon carries the count of what it has left — a meal with one fight to
 * run looked exactly like a fresh one, which is how people found out theirs had
 * expired by losing a fight they thought they were buffed for. Tapping one opens
 * what it is actually doing, since a meal's whole value is two percentages the
 * player has never been shown.
 */
export default function BuffList(props: Props) {
  const modalStore = useModalStore();

  return (
    <div className={styles.container}>
      <ForEach
        items={props.buffs}
        render={(held) => (
          <button
            key={held.buff.id}
            type="button"
            className={styles.buff}
            title={`${held.buff.name} · ${durationUnit(held.buff, held.duration)}`}
            onClick={() => modalStore.setBuffInfo({ open: true, buff: held })}
          >
            <img width={25} height={25} src={held.buff.image} alt={held.buff.name} />
            {/* A barrier is only worth what is left in it, so that number wins
                the corner: the icon alone still reads as "protected" long after
                the pool has been spent down to nothing. Everything else counts
                down in whatever unit it is spent in. */}
            <When value={held.barrier !== undefined}>
              <span className={styles.barrier}>{held.barrier}</span>
            </When>
            <When value={held.barrier === undefined}>
              <span className={styles.duration}>{held.duration}</span>
            </When>
          </button>
        )}
      />
    </div>
  );
}
