import { StatBar } from '../StatBar';

type Props = {
  currentHealth: number;
  maxHealth: number;
  minWidth?: string;
  minHeight?: string;
};

export default function HealthBar(props: Props) {
  return (
    <StatBar
      variant="health"
      percentage={Math.floor((props.currentHealth / props.maxHealth) * 100)}
      label={`HP ${props.currentHealth}/${props.maxHealth}`}
      minWidth={props.minWidth}
      minHeight={props.minHeight}
    />
  );
}
