import { Capacitor } from "@capacitor/core";
import {
  AppUpdate,
  AppUpdateAvailability,
} from "@capawesome/capacitor-app-update";

const getCurrentAppVersion = async () => {
  if (Capacitor.getPlatform() === "android") {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.currentVersionCode;
  } else {
    return undefined;
  }
};

const getAvailableAppVersion = async () => {
  if (Capacitor.getPlatform() === "android") {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.availableVersionCode;
  } else {
    return undefined;
  }
};

const openAppStore = async () => {
  await AppUpdate.openAppStore();
};

const performImmediateUpdate = async () => {
  const result = await AppUpdate.getAppUpdateInfo();
  if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
    return;
  }
  if (result.immediateUpdateAllowed) {
    await AppUpdate.performImmediateUpdate();
  }
};

const startFlexibleUpdate = async () => {
  const result = await AppUpdate.getAppUpdateInfo();
  if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
    return;
  }
  if (result.flexibleUpdateAllowed) {
    await AppUpdate.startFlexibleUpdate();
  }
};

const completeFlexibleUpdate = async () => {
  await AppUpdate.completeFlexibleUpdate();
};

export const Updater = {
  getCurrentAppVersion,
  getAvailableAppVersion,
  openAppStore,
  performImmediateUpdate,
  startFlexibleUpdate,
  completeFlexibleUpdate,
};
