import { FloatingNavBar } from "@/components/FloatingNavBar";
import { Header } from "@/components/Header";

import { Outlet } from "react-router-dom";

export function NavigationLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <FloatingNavBar />
    </>
  );
}
