import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { ProfilePage } from "@/pages/profile";
import { useUserStore } from "@/store/user";

export function AdminLayout() {
  const userStore = useUserStore();

  if (!userStore.user?.admin) {
    return <ProfilePage />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
