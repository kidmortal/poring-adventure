import cn from 'classnames';
import styles from './style.module.scss';

type Props = {
  leftLabel: string;
  rightLabel: string;
  selected: 'left' | 'right';
  onSelect: (value: 'left' | 'right') => void;
};

export default function Switch(props: Props) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => props.onSelect('left')}
        className={cn(styles.switchOption, {
          [styles.selected]: props.selected === 'left',
        })}
      >
        {props.leftLabel}
      </button>
      <button
        onClick={() => props.onSelect('right')}
        className={cn(styles.switchOption, {
          [styles.selected]: props.selected === 'right',
        })}
      >
        {props.rightLabel}
      </button>
    </div>
  );
}
