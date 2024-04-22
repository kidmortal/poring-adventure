import { useDetectClickOutsideElement } from '@/hooks/useDetectClickOutsideElement';
import styles from './style.module.scss';
import React from 'react';
import { When } from '@/components/shared/When';

type Props = {
  isOpen?: boolean;
  children?: React.ReactNode;
  onRequestClose: () => void;
};

export function BaseModal({ isOpen = false, children, onRequestClose }: Props) {
  const { containerRef } = useDetectClickOutsideElement({
    onClickOutside: () => onRequestClose(),
  });

  return (
    <When value={isOpen}>
      <div className={styles.container}>
        <div ref={containerRef} className={styles.modalBox}>
          {children}
        </div>
      </div>
    </When>
  );
}
