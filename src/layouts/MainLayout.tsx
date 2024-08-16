import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <main className="container mt-16">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
