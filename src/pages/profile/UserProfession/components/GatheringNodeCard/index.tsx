import styles from './style.module.scss';

import ForEach from '@/components/shared/ForEach';
import { ActionCard } from '../ActionCard';
import { ItemChip } from '../ItemChip';

type Props = {
  node: GatheringNode;
  /** Undefined while the profession is not learned. */
  professionLevel?: number;
  stamina: number;
  busy?: boolean;
  lastResult?: GatherResult;
  onGather: () => void;
};

export function GatheringNodeCard({ node, professionLevel, stamina, busy, lastResult, onGather }: Props) {
  const profession = node.profession;

  let blockedReason: string | undefined;
  if (professionLevel === undefined) {
    blockedReason = `Learn ${profession?.name ?? 'the profession'} first`;
  } else if (professionLevel < node.requiredLevel) {
    blockedReason = `Requires level ${node.requiredLevel}`;
  } else if (stamina < node.staminaCost) {
    blockedReason = 'Not enough stamina';
  }

  return (
    <ActionCard
      icon={profession?.icon ?? '❔'}
      title={node.name}
      subtitle={`${profession?.name ?? ''} · Lv ${node.requiredLevel}`}
      staminaCost={node.staminaCost}
      experience={node.experience}
      actionLabel="Gather"
      blockedReason={blockedReason}
      busy={busy}
      result={lastResult && <GatherOutcome node={node} result={lastResult} />}
      onAction={onGather}
    >
      <ForEach
        items={node.drops}
        render={(drop) => (
          <ItemChip
            key={drop.id}
            item={drop.item}
            amount={drop.maxAmount}
            note={`${drop.chance}%`}
          />
        )}
      />
    </ActionCard>
  );
}

/** Drops come back as ids only, so the node's own table supplies the artwork. */
function GatherOutcome({ node, result }: { node: GatheringNode; result: GatherResult }) {
  if (result.drops.length === 0) {
    return <span className={styles.empty}>Nothing this time</span>;
  }

  return (
    <>
      <span>Found</span>
      <ForEach
        items={result.drops}
        render={(drop) => (
          <ItemChip
            key={drop.itemId}
            item={node.drops.find((d) => d.itemId === drop.itemId)?.item}
            amount={drop.amount}
          />
        )}
      />
    </>
  );
}
