import { When } from "@/components/When";
import styles from "./style.module.scss";

type Props = {
  monster?: Monster;
};

export function BattleMonsterInfo(props: Props) {
  return (
    <When value={!!props.monster}>
      <div className={styles.monsterContainer}>
        <span>{props.monster?.name}</span>
        <span>HP {props.monster?.health}</span>
        <span>attack {props.monster?.attack}</span>
        <img src={props.monster?.image} />
      </div>
    </When>
  );
}
