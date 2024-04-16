import styles from "./style.module.scss";

import { PurchasedStoreProducts } from "./purchasedProducts";
import { Button } from "@/components/Button";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { When } from "@/components/When";
import { AvailableStoreProducts } from "./availableProducts";

export function StorePage() {
  const plataform = Capacitor.getPlatform();
  const onWeb = plataform === "web";
  const [storeView, setStoreView] = useState<"store" | "purchases">(
    onWeb ? "store" : "store"
  );

  return (
    <div className={styles.container}>
      <div className={styles.storeSwitch}>
        <Button
          label={`Store ${onWeb ? "not available on web" : ""}`}
          disabled={onWeb}
          onClick={() => setStoreView("store")}
        />
        <Button
          label="My Purchases"
          onClick={() => setStoreView("purchases")}
        />
      </div>
      <div className={styles.scrollList}>
        <When value={storeView === "store"}>
          <AvailableStoreProducts />
        </When>
        <When value={storeView === "purchases"}>
          <PurchasedStoreProducts />
        </When>
      </div>
    </div>
  );
}
