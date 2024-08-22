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
import { toast } from "sonner";
import { Profile, Room } from "@/types/api";
import { muteRoom, unmuteRoom } from "@/api/room";
import { useRef, useState } from "react";
import useAuthStore from "@/stores/auth";
import { removeMemberGroup, leaveGroup, deleteGroup } from "@/api/group";
import GroupAddMemberModal from "./GroupAddMemberModal";
import UserInfoModal from "./UserInfoModal";
import { updateGroupPhoto, updateGroupName } from "@/api/group";
import { uploadFile } from "@/api/file";
import { PenLineIcon, XIcon, SaveIcon, TrashIcon, EyeIcon } from "lucide-react";
import { Input } from "./ui/input";

interface GroupInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Room;
}
const GroupInfoModal = ({ isOpen, onClose, group }: GroupInfoModalProps) => {
  const { profile } = useAuthStore();
  const { currentInbox, updateInbox, deteteInbox, setCurrentInbox } =
    useChatStore();
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isMuted, setIsMuted] = useState(currentInbox?.room.muted);
  const selfOwner =
    group.members.find((member) => member.owner)?.id === profile?.id;
  const [isOpenUserInfo, setIsOpenUserInfo] = useState(false);
  const [currentMember, setCurrentMember] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState(group.name!);
  const [editMode, setEditMode] = useState(false);

  if (!currentInbox) {
    return <p>Something wrong!</p>;
  }

  const handleMute = async () => {
    const roomId = currentInbox.room.id;
    if (roomId) {
      try {
        const res = await muteRoom(roomId);
        if (res.status === 200 && res.data) {
          toast.success("Room muted");
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUnmute = async () => {
    const roomId = currentInbox.room.id;
    if (roomId) {
      try {
        const res = await unmuteRoom(roomId);
        if (res.status === 200 && res.data) {
          toast.success("Room unmuted");
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChangeNotification = async () => {
    if (currentInbox?.room.muted) {
      await handleUnmute();
    } else {
      await handleMute();
    }
  };

  const handleRemoveMember = async (member: Profile) => {
    try {
      const res = await removeMemberGroup(group.id, member.id);
      if (res.status === 200 && res.data) {
        toast.success(`Member ${member.nickname} removed`);
        updateInbox({
          ...currentInbox,
          room: {
            ...currentInbox.room,
            members: currentInbox.room.members.filter(
              (m) => m.id !== member.id
            ),
          },
        });
        currentInbox.room.members = currentInbox.room.members.filter(
          (m) => m.id !== member.id
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup(group.id);
      if (res.status === 200 && res.data) {
        deteteInbox(group.id);
        setCurrentInbox(null);
        onClose();
        toast.success("Group left");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const res = await deleteGroup(group.id);
      if (res.status === 200 && res.data) {
        deteteInbox(group.id);
        setCurrentInbox(null);
        onClose();
        toast.success("Group deleted");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await uploadFile(formData);
        if (res.status === 200 && res.data) {
          await handleUpdateGroupPhoto(res.data.data.url);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdateGroupPhoto = async (url: string) => {
    try {
      const res = await updateGroupPhoto(group.id, { photo: url });
      if (res.status === 200 && res.data) {
        toast.success("Group photo updated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveGroupName = async () => {
    if (!groupName) return;

    try {
      const res = await updateGroupName(group.id, { name: groupName });
      if (res.status === 200 && res.data) {
        currentInbox.room.name = res.data.data.name;
        setEditMode(false);
        toast.success("Group name updated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <GroupAddMemberModal
        isOpen={isOpenAddMember}
        onClose={() => setIsOpenAddMember(false)}
      />
      {currentMember && isOpenUserInfo && (
        <UserInfoModal
          isOpen={isOpenUserInfo}
          onClose={() => setIsOpenUserInfo(false)}
          profile={currentMember}
        />
      )}
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          onClose();
          setEditMode(false);
          setGroupName(group.name!);
        }}
      >
        <DialogContent className="max-h-screen overflow-y-scroll overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="mb-2">Group Info</DialogTitle>
            <DialogDescription>
              Group information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col space-y-4">
            <div className="flex items-center space-x-2 rounded-lg border p-3 shadow-sm">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadFile}
                className="hidden"
              />
              <UserAvatar
                avatar={group.image!}
                name={group.name!}
                className="w-16 h-16 text-2xl hover:outline hover:outline-2 hover:outline-rose-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <div className="flex flex-col">
                <div className="flex space-x-1 items-center">
                  {editMode ? (
                    <>
                      <Input
                        className="font-semibold"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                      <XIcon
                        className="w-4 h-4 cursor-pointer hover:scale-150"
                        onClick={() => {
                          setEditMode(false);
                          setGroupName(group.name!);
                        }}
                      />
                      <SaveIcon
                        className="w-4 h-4 cursor-pointer hover:scale-150"
                        onClick={handleSaveGroupName}
                      />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-base text-black">
                        {group.name}
                      </span>
                      <PenLineIcon
                        className="w-4 h-4 cursor-pointer hover:scale-150"
                        onClick={() => setEditMode(true)}
                      />
                    </>
                  )}
                </div>
                <span className="text-xs">{group.members.length} Members</span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-3 shadow-sm space-y-2">
              <div className="flex flex-row justify-between items-center">
                <span>Members ({group.members.length})</span>
                {selfOwner && (
                  <Button
                    size={"sm"}
                    variant={"default"}
                    onClick={() => setIsOpenAddMember(true)}
                  >
                    Add
                  </Button>
                )}
              </div>
              {group.members
                .sort((m) => (m.owner ? -1 : 1))
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-row justify-between items-center"
                  >
                    <div className="flex flex-row items-center space-x-2">
                      <UserAvatar
                        avatar={member.avatar}
                        name={member.nickname}
                        className="w-12 h-12"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-base text-black">
                          {member.nickname} {member.owner && "(owner)"}
                        </span>
                        <span className="text-xs">
                          last seen at {member.lastSeenAt.toString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <EyeIcon
                        className="w-4 h-4 cursor-pointer text-gray-600 hover:scale-125 transition-transform duration-300"
                        onClick={() => {
                          setCurrentMember(member);
                          setIsOpenUserInfo(true);
                        }}
                      />
                      {selfOwner && profile?.id !== member.id && (
                        <TrashIcon
                          className="w-4 h-4 cursor-pointer text-red-600 hover:scale-125 transition-transform duration-300"
                          onClick={() => handleRemoveMember(member)}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <span>Notifications</span>
              <Switch
                checked={!isMuted}
                onCheckedChange={handleChangeNotification}
              />
            </div>
            <div className="flex flex-col items-cente rounded-lg border p-3 shadow-sm space-y-2">
              {selfOwner ? (
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  className="w-full"
                  onClick={handleDeleteGroup}
                >
                  Delete group
                </Button>
              ) : (
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  className="w-full"
                  onClick={handleLeaveGroup}
                >
                  Leave group
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupInfoModal;
