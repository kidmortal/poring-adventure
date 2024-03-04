import { Outlet } from "react-router-dom";

export function LimitedSizeLayout() {
  return (
    <div>
      <h1>Limited Size layer</h1>
      <Outlet />
    </div>
  );
}
