import { Outlet } from 'react-router-dom';
import styles from './style.module.scss';

import { useMainStore } from '@/store/main';
import { When } from '@/components/shared/When';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';

export function PageLoadingLayout() {
  const store = useMainStore();
  return (
    <>
      <When value={store.isLoading}>
        <div className={styles.coverBackground} />
        <FullscreenLoading info="Fetching login data" />
      </When>
      <Outlet />
    </>
  );
}
