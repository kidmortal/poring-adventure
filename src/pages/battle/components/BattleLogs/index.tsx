import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { When } from "@/components/When";

type Props = {
  logs?: BattleLog[];
};

export function BattleLogs({ logs }: Props) {
  return (
    <div className={styles.logContainer}>
      <ForEach
        items={logs}
        render={(log) => (
          <div key={`${log.message}${crypto.randomUUID()}`}>
            <When value={!!log.icon}>
              <img width={20} height={20} src={log.icon} />
            </When>
            <span key={`${log}${crypto.randomUUID()}`}>{log.message}</span>
          </div>
        )}
      />
    </div>
  );
}
