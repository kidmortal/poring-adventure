import { ResourceStack } from '../ResourceStack';

export function SilverStack({ amount }: { amount?: number }) {
  return <ResourceStack variant="silver" amount={amount} />;
}
