import { Outlet } from "react-router-dom";

import { useMainStore } from "@/store/main";

export function PageLoadingLayout() {
  const store = useMainStore();

  if (store.isLoading.application) {
    return <span>Loading</span>;
  }

  return <Outlet />;
}
