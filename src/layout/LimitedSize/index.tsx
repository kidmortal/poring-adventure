import { Outlet } from 'react-router-dom';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import styles from './style.module.scss';
import { Capacitor } from '@capacitor/core';
import 'react-toastify/dist/ReactToastify.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Updater } from '@/config/updater';
import * as RevenueCat from '@revenuecat/purchases-capacitor';
import { UpdateAvailableMessageScreen } from '@/screens/UpdateAvailableMessage';
import { When } from '@/components/shared/When';
import { useAdminStore } from '@/store/admin';
import { GameToastContainer } from '@/components/Toast';
import { useDevicePreviewStore } from '@/store/devicePreview';
import { useFitScale } from '@/hooks/useFitScale';

export function LimitedSizeLayout() {
  const adminStore = useAdminStore();
  const preview = useDevicePreviewStore();
  const [isOudated, setIsOudated] = useState(false);
  const plataform = Capacitor.getPlatform();

  async function verifyAppVersion() {
    try {
      const currentVersion = await Updater.getCurrentAppVersion();
      const availableVersion = await Updater.getAvailableAppVersion();
      adminStore.setNativeServices({ updater: true });
      if (currentVersion !== availableVersion) {
        setIsOudated(true);
      }
    } catch (error) {
      adminStore.setNativeServices({ updater: false });
      console.log('cant update');
    }
  }

  async function lockScreenToPortrait() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      adminStore.setNativeServices({ lockPortrait: true });
    } catch (error) {
      adminStore.setNativeServices({ lockPortrait: false });
    }
  }
  async function configureRevenueCat() {
    try {
      RevenueCat.Purchases.configure({
        apiKey: import.meta.env.VITE_REVENUE_CAT_API_KEY ?? '',
      });
      adminStore.setNativeServices({ purchase: true });
    } catch (error) {
      adminStore.setNativeServices({ purchase: false });
    }
  }

  const device = preview.device;
  // What the page actually gets: the screen, less the browser's own bar when it
  // is showing, less nothing else — the safe areas are padding inside it.
  const viewportHeight = device ? device.height - (preview.showChrome ? device.chrome : 0) : 0;
  const scale = useFitScale({ width: device?.width ?? 0, height: viewportHeight });

  useEffect(() => {
    if (plataform === 'android') {
      verifyAppVersion();
      lockScreenToPortrait();
      configureRevenueCat();
    }
  }, []);

  const content = (
    <>
      <GameToastContainer />
      <When value={isOudated}>
        <UpdateAvailableMessageScreen onCancelUpdate={() => setIsOudated(false)} />
      </When>
      <When value={!isOudated}>
        <Outlet />
      </When>
    </>
  );

  return (
    <div className={cn(styles.container, { [styles.previewStage]: !!device })}>
      <div
        className={cn(styles.limitedContainer, {
          // The caps are what the preview is replacing, so they step aside for it.
          [styles.limitedDev]: !device && import.meta.env.DEV && import.meta.env.VITE_DEV,
          [styles.limitSize]: !device && plataform === 'web',
          [styles.previewFrame]: !!device,
        })}
        style={
          device
            ? {
                width: device.width,
                height: viewportHeight,
                paddingTop: device.safeTop,
                paddingBottom: device.safeBottom,
                transform: `scale(${scale})`,
              }
            : undefined
        }
      >
        {device ? (
          // Page zoom takes CSS pixels away from the viewport rather than
          // adding them to the text, so the zoomed layer is *narrower* than the
          // screen and `zoom` paints it back up to full size — which is what
          // the phone does, and why zoom is where overflow appears first.
          <div
            className={styles.zoomLayer}
            style={{
              zoom: preview.textZoom,
              width: device.width / preview.textZoom,
              height: viewportHeight / preview.textZoom,
            }}
          >
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
