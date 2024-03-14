import { When } from "@/components/When";
import styles from "./style.module.scss";
import { RefObject, useRef } from "react";

type Props = {
  monster?: Monster;
};

export function BattleMonsterInfo({ monster }: Props) {
  const monsterRef = useRef<RefObject<HTMLDivElement>>();

  return (
    <When value={!!monster}>
      <div ref={monsterRef.current} className={styles.monsterContainer}>
        <When value={false}>
          <span className={styles.animatedDamage}>-6</span>
        </When>
        <span>{monster?.name}</span>
        <span>HP {monster?.health}</span>
        <span>attack {monster?.attack}</span>
        <img src={monster?.image} />
      </div>
    </When>
  );
}
