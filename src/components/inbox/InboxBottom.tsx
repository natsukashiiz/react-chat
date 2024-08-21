import { Button } from "../ui/button";
import ConfirmLogoutModal from "../ConfirmLogoutModal";
import UserAvatar from "../UserAvatar";
import useAuthStore from "@/stores/auth";
import MyProfileModal from "../MyProfileModal";
import { useState } from "react";

const InboxBottom = () => {
  const { clearAuth, profile } = useAuthStore();
  const [isOpenMyProfile, setIsOpenMyProfile] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    profile && (
      <>
        <MyProfileModal
          isOpen={isOpenMyProfile}
          onClose={() => setIsOpenMyProfile(false)}
        />
        <div className="p-2 flex justify-between w-full items-center gap-2 border-t flex-wrap">
          <div className="flex space-x-2">
            <UserAvatar avatar={profile.avatar} name={profile.nickname} />
            <div>
              <div className="font-semibold">{profile.nickname}</div>
              <div className="text-sm text-gray-500">@{profile.username}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size={"sm"} onClick={() => setIsOpenMyProfile(true)}>
              Profile
            </Button>
            <ConfirmLogoutModal handleLogout={handleLogout}>
              <Button size={"sm"}>Logout</Button>
            </ConfirmLogoutModal>
          </div>
        </div>
      </>
    )
  );
};

export default InboxBottom;
