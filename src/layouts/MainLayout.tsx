import { Outlet } from "react-router";

import RCNavbar from "@/components/RCNavbar";

const MainLayout = () => {
  return (
    <>
      <RCNavbar />
      <main className="container mt-16">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
