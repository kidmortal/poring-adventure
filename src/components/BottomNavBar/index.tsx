import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import { useBattleStore } from "@/store/battle";
import cn from "classnames";

export function BottomNavBar() {
  const battleStore = useBattleStore();
  const userIsInBattle = !!battleStore.battle;
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <span
        className={cn({ [styles.disabled]: userIsInBattle })}
        onClick={() => {
          if (!userIsInBattle) navigate("/profile");
        }}
      >
        Profile
      </span>
      <span
        className={cn({ [styles.disabled]: userIsInBattle })}
        onClick={() => {
          if (!userIsInBattle) navigate("/ranking");
        }}
      >
        Ranking
      </span>
      <span
        className={cn({ [styles.disabled]: userIsInBattle })}
        onClick={() => {
          if (!userIsInBattle) navigate("/market");
        }}
      >
        Market
      </span>
      <span onClick={() => navigate("/battle")}>Battle</span>
    </div>
  );
}
