import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { When } from "@/components/When";
import { useBattleStore } from "@/store/battle";

type Props = {
  party: Party;
  onConfirm: () => void;
  onRefuse: () => void;
};

export function InviteBox({ party, onConfirm, onRefuse }: Props) {
  const battleStore = useBattleStore();
  let leaderName = "";
  const isInBattle = !!battleStore.battle;

  if (party.leaderEmail) {
    const leader = party.members?.find(
      (member) => member.email === party.leaderEmail
    );

    if (leader) {
      leaderName = leader.name;
    }
  }

  return (
    <div className={styles.container}>
      <strong>{leaderName} Invited you to his party</strong>
      <When value={isInBattle}>
        <span className={styles.warning}>Finish your battle to accept</span>
      </When>
      <div className={styles.optionsContainer}>
        <Button
          theme="success"
          label="Accept"
          onClick={() => onConfirm()}
          disabled={isInBattle}
        />
        <Button theme="danger" label="Refuse" onClick={() => onRefuse()} />
      </div>
    </div>
  );
}
