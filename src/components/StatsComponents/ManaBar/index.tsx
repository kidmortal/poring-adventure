import { StatBar } from '../StatBar';

type Props = {
  currentHealth: number;
  maxHealth: number;
  minWidth?: string;
  minHeight?: string;
};

export default function ManaBar(props: Props) {
  return (
    <StatBar
      variant="mana"
      percentage={Math.floor((props.currentHealth / props.maxHealth) * 100)}
      label={`MP ${props.currentHealth}/${props.maxHealth}`}
      minWidth={props.minWidth}
      minHeight={props.minHeight}
    />
  );
}
