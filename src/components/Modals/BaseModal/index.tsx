import { useDetectClickOutsideElement } from "@/hooks/useDetectClickOutsideElement";
import styles from "./style.module.scss";
import React from "react";

type Props = {
  children?: React.ReactNode;
  onRequestClose: () => void;
};

export function BaseModal(props: Props) {
  const { containerRef } = useDetectClickOutsideElement({
    onClickOutside: () => props.onRequestClose(),
  });
  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.modalBox}>
        {props.children}
      </div>
    </div>
  );
}
