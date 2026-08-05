import { ToastContainer } from 'react-toastify';

import styles from './style.module.scss';

/**
 * The app's only toast container: small, top-centred, and capped at three.
 *
 * A phone screen is about 800px tall and a full-width 64px card is a twelfth of
 * it — three of those, which is what a busy fight produced in seconds, covered
 * the fight itself. This one is a pill the width of a sentence, and the cap is
 * what stops a burst of unrelated events doing the same thing dedupe stops a
 * repeated one doing.
 */
export function GameToastContainer() {
  return (
    <ToastContainer
      position="top-center"
      limit={3}
      newestOnTop
      hideProgressBar
      closeButton={false}
      closeOnClick
      draggable
      pauseOnFocusLoss={false}
      theme="dark"
      className={styles.container}
      toastClassName={styles.toast}
      bodyClassName={styles.bodyWrapper}
    />
  );
}
