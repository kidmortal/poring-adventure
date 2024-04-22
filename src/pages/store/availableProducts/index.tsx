import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import * as RevenueCat from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import { Button } from '@/components/shared/Button';
import { useMutation } from '@tanstack/react-query';

async function purchaseProduct(product: RevenueCat.PurchasesStoreProduct) {
  try {
    await RevenueCat.Purchases.purchaseStoreProduct({
      product,
    });
  } catch (error) {
    alert('Purchase canceled');
  }
}

export function AvailableStoreProducts() {
  const [offerings, setOfferings] = useState<RevenueCat.PurchasesOfferings | undefined>(undefined);
  const platform = Capacitor.getPlatform();

  async function getOfferings() {
    if (platform === 'android') {
      const offers = await RevenueCat.Purchases.getOfferings();
      setOfferings(offers);
    }
  }

  useEffect(() => {
    getOfferings();
  }, []);

  return (
    <div className={styles.container}>
      <When value={platform === 'web'}>
        <h1>Store not avaible on Web</h1>
      </When>
      <ForEach
        items={offerings?.current?.availablePackages}
        render={(pack) => <ProductInfo product={pack.product} key={pack.identifier} />}
      />
    </div>
  );
}

function ProductInfo(props: { product: RevenueCat.PurchasesStoreProduct }) {
  const purchaseProductMutation = useMutation({
    mutationFn: () => purchaseProduct(props.product),
  });

  return (
    <div className={styles.productInfoContainer}>
      <span>{props.product.description}</span>
      <img src={`https://kidmortal.sirv.com/misc/${props.product.identifier}.png?w=60&h=60`} />
      <Button
        label={`Buy R$${props.product.price}`}
        onClick={() => purchaseProductMutation.mutate()}
        disabled={purchaseProductMutation.isPending}
      />
    </div>
  );
}
