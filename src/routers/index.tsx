import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Chat from "@/pages/Chat";
import Friends from "@/pages/Friends";
import AuthProvider from "@/providers/AuthProvider";

const routers = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
    ],
  },
]);

export default routers;
