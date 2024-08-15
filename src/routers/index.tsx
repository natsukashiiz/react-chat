import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
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
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
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
