import { RouterProvider } from "react-router-dom";
import routers from "./routers";
import useAuthStore from "./stores/auth";
import { useEffect } from "react";

const App = () => {
  const { loadAuth } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return <RouterProvider router={routers} />;
};

export default App;
