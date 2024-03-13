import { Button } from "@/components/Button";
import styles from "./style.module.scss";

type Props = {
  party: Party;
  onConfirm: () => void;
  onRefuse: () => void;
};

export function InviteBox({ party, onConfirm, onRefuse }: Props) {
  let leaderName = "";

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
      <div className={styles.optionsContainer}>
        <Button theme="success" label="Accept" onClick={() => onConfirm()} />
        <Button theme="danger" label="Refuse" onClick={() => onRefuse()} />
      </div>
    </div>
  );
}
