import { StatBar } from '../StatBar';

type Props = {
  currentExp?: number;
  level?: number;
  minWidth?: string;
  minHeight?: string;
};

/** Total exp required to reach `level`. */
function totalExpForLevel(level: number) {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += i * 100;
  }
  return total;
}

export default function ExperienceBar(props: Props) {
  const currentExp = props.currentExp ?? 0;
  const level = props.level ?? 0;
  const expIntoLevel = currentExp - totalExpForLevel(level);
  const expForNextLevel = totalExpForLevel(level + 1);

  return (
    <StatBar
      variant="experience"
      percentage={Math.floor((expIntoLevel / expForNextLevel) * 100)}
      label={`Exp ${currentExp}`}
      minWidth={props.minWidth}
      minHeight={props.minHeight}
    />
  );
}
