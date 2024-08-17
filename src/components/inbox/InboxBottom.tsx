import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import ConfirmLogoutModal from "../ConfirmLogoutModal";
import UserAvatar from "../UserAvatar";
import useAuthStore from "@/stores/auth";

const InboxBottom = () => {
  const { clearAuth, profile } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    profile && (
      <div className="p-2 flex justify-between w-full items-center gap-2 border-t flex-wrap">
        <div className="flex space-x-2">
          <UserAvatar avatar={profile.avatar} name={profile.nickname} />
          <div>
            <div className="font-semibold">{profile.nickname}</div>
            <div className="text-sm text-gray-500">{profile.mobile}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size={"sm"} asChild>
            <Link to={"/profile"}>Profile</Link>
          </Button>
          <ConfirmLogoutModal handleLogout={handleLogout}>
            <Button size={"sm"}>Logout</Button>
          </ConfirmLogoutModal>
        </div>
      </div>
    )
  );
};

export default InboxBottom;
