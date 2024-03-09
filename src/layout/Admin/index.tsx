import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { useMainStore } from "@/store/main";
import { ProfilePage } from "@/pages/profile";

export function AdminLayout() {
  const store = useMainStore();

  if (!store.userCharacterData?.admin) {
    return <ProfilePage />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
