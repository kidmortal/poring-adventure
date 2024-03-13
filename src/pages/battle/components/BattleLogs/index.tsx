import ForEach from "@/components/ForEach";
import { When } from "@/components/When";

type Props = {
  logs?: BattleLog[];
};

export function BattleLogs({ logs }: Props) {
  return (
    <ForEach
      items={logs}
      render={(log) => (
        <div key={`${log.message}${crypto.randomUUID()}`}>
          <When value={!!log.icon}>
            <img
              width={15}
              height={15}
              src={`https://kidmortal.sirv.com/skills/${log.icon}.webp`}
            />
          </When>
          <span key={`${log}${crypto.randomUUID()}`}>{log.message}</span>
        </div>
      )}
    />
  );
}
