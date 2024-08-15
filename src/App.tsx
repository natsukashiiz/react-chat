import { RouterProvider } from "react-router-dom";
import routers from "./routers";
import useAuthStore from "./stores/auth";
import { useEffect } from "react";
import useProfileStore from "./stores/profile";

const App = () => {
  const { loadAuth, authenticated } = useAuthStore();
  const { loadProfile } = useProfileStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (authenticated) {
      loadProfile();
    }
  }, [loadProfile, authenticated]);

  return <RouterProvider router={routers} />;
};

export default App;
