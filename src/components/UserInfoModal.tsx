import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import UserAvatar from "./UserAvatar";
import useChatStore from "@/stores/chat";
import { Button } from "./ui/button";
import { blockFriend, unblockFriend, unfriend } from "@/api/friend";
import { toast } from "sonner";
import { Profile } from "@/types/api";
import { FriendStatus } from "@/types/enum";
import { muteRoom, unmuteRoom } from "@/api/room";
import { useState } from "react";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  status?: FriendStatus;
}
const UserInfoModal = ({
  isOpen,
  onClose,
  profile,
  status,
}: UserInfoModalProps) => {
  const { currentInbox, updateInbox, deteteInbox } = useChatStore();
  const [isMuted, setIsMuted] = useState(currentInbox?.room.muted);
  const friendId = status ? currentInbox?.room.friend.profile.id : profile.id;
  const roomId = currentInbox?.room.id;

  if (!friendId || !roomId) {
    return <p>Something wrong!</p>;
  }

  const handleBlock = async () => {
    try {
      const res = await blockFriend(friendId);
      if (res.status === 200 && res.data) {
        toast.success("User blocked");
        if (currentInbox) {
          updateInbox({
            ...currentInbox,
            room: {
              ...currentInbox.room,
              friend: {
                ...currentInbox.room.friend,
                status: FriendStatus.BlockBySelf,
              },
            },
          });
          currentInbox.room.friend.status = FriendStatus.BlockBySelf;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await unblockFriend(friendId);
      if (res.status === 200 && res.data) {
        toast.success("User unblocked");
        if (currentInbox) {
          updateInbox({
            ...currentInbox,
            room: {
              ...currentInbox.room,
              friend: {
                ...currentInbox.room.friend,
                status: FriendStatus.Friend,
              },
            },
          });
          currentInbox.room.friend.status = FriendStatus.Friend;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfriend = async () => {
    try {
      const res = await unfriend(friendId);
      if (res.status === 200 && res.data) {
        toast.success("User unfriended");
        if (currentInbox) {
          deteteInbox(currentInbox.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMute = async () => {
    const roomId = currentInbox?.room.id;
    if (roomId) {
      try {
        const res = await muteRoom(roomId);
        if (res.status === 200 && res.data) {
          toast.success("Room muted");
          if (currentInbox) {
            updateInbox({
              ...currentInbox,
              room: {
                ...currentInbox.room,
                muted: true,
              },
            });
            currentInbox.room.muted = true;
            setIsMuted(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUnmute = async () => {
    try {
      const res = await unmuteRoom(roomId);
      if (res.status === 200 && res.data) {
        toast.success("Room unmuted");
        if (currentInbox) {
          updateInbox({
            ...currentInbox,
            room: {
              ...currentInbox.room,
              muted: false,
            },
          });
          currentInbox.room.muted = false;
          setIsMuted(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeNotification = async () => {
    if (currentInbox?.room.muted) {
      await handleUnmute();
    } else {
      await handleMute();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-screen overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2">User Info</DialogTitle>
          <DialogDescription>User information and settings</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col space-y-4">
          <div className="flex items-center space-x-2 rounded-lg border p-3 shadow-sm">
            <UserAvatar
              avatar={profile.avatar}
              name={profile.nickname}
              className="w-16 h-16 text-2xl"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-base text-black">
                {profile.nickname}
              </span>
              <span className="text-xs">
                last seen at {profile.lastSeenAt.toString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border p-3 shadow-sm space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-black">{profile.mobile}</span>
              <span className="text-xs">Mobile</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-black">@{profile.username}</span>
              <span className="text-xs">Username</span>
            </div>
          </div>
          {status === FriendStatus.Friend && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <span>Notifications</span>
              <Switch
                checked={!isMuted}
                onCheckedChange={handleChangeNotification}
              />
            </div>
          )}
          {status && (
            <div className="flex flex-col items-cente rounded-lg border p-3 shadow-sm space-y-2">
              <div className="flex flex-row items-center justify-between">
                <span>Block</span>
                {status === FriendStatus.BlockBySelf ? (
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    onClick={handleUnblock}
                  >
                    Unblock
                  </Button>
                ) : (
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    onClick={handleBlock}
                  >
                    Block
                  </Button>
                )}
              </div>
              <div className="flex flex-row items-center justify-between">
                <span>Unfriend</span>
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  onClick={handleUnfriend}
                >
                  Unfriend
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoModal;
