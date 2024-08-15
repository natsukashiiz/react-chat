import { Link, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/auth";
import RCProfileMenu from "./RCProfileMenu";

interface Menu {
  name: string;
  path: string;
}
const publicMenu: Menu[] = [
  { name: "Home", path: "/" },
  { name: "Chat", path: "/chat" },
];
const authMenu: Menu[] = [
  { name: "Create Account", path: "/sign-up" },
  { name: "Login", path: "/login" },
];

const MenuLink = ({ menu }: { menu: Menu }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Link
      to={menu.path}
      className={`${
        pathname === menu.path
          ? "text-gray-900 bg-gray-200/80 transition duration-300"
          : ""
      } hover:text-gray-900 rounded-xl px-2 py-1`}
    >
      {menu.name}
    </Link>
  );
};

const RCNavbar = () => {
  const { authenticated } = useAuthStore();

  return (
    <nav className="w-full px-32 h-14 flex items-center justify-between bg-opacity-80 fixed top-0 bg-white border-b">
      <ul className="flex justify-center space-x-5 text-gray-500">
        <li key={"icon"}>
          <span className="font-bold text-rose-400">React-Chat</span>
        </li>
        {publicMenu.map((menu) => (
          <li key={menu.path}>
            <MenuLink menu={menu} />
          </li>
        ))}
      </ul>
      <ul className="flex justify-center space-x-5 text-gray-500">
        {authenticated ? (
          <li key={"profile-menu"}>
            <RCProfileMenu />
          </li>
        ) : (
          authMenu.map((menu) => (
            <li key={menu.path}>
              <MenuLink menu={menu} />
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default RCNavbar;
