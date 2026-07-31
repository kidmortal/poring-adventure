import { ResourceStack } from '../ResourceStack';

export function ExpStack({ amount }: { amount?: number }) {
  return <ResourceStack variant="exp" amount={amount} />;
}
