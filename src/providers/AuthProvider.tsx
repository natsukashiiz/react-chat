import useAuthStore from "@/stores/auth";
import { Outlet } from "react-router";

const AuthProvider = () => {
  const { authenticated } = useAuthStore();

  if (authenticated === false) {
    return (
      <p>
        Please login to continue{" "}
        <a href="/login" className="underline">
          login
        </a>
      </p>
    );
  }

  return <Outlet />;
};

export default AuthProvider;
