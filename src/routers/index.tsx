import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Chat from "@/pages/Chat";
import Friends from "@/pages/Friends";

const routers = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Chat />,
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
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/friends",
    element: <Friends />,
  },
]);

export default routers;
