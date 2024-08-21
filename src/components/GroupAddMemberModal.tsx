import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getFriends } from "@/api/friend";
import { FriendStatus } from "@/types/enum";
import { addMemberGroup } from "@/api/group";
import { Friend, Profile } from "@/types/api";
import UserAvatar from "./UserAvatar";
import useChatStore from "@/stores/chat";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface GroupAddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const GroupAddMemberModal = ({ isOpen, onClose }: GroupAddMemberModalProps) => {
  const { currentInbox, updateInbox } = useChatStore();
  const [friendList, setFriendList] = useState<Friend[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await getFriends(FriendStatus.Friend);
        if (res.status === 200 && res.data) {
          setFriendList(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadFriends();
  }, []);

  if (!currentInbox) return;

  const handleAddMember = async (member: Profile) => {
    try {
      const res = await addMemberGroup(currentInbox.room.id, {
        memberIds: [member.id],
      });
      if (res.status === 200 && res.data) {
        updateInbox({
          ...currentInbox,
          room: {
            ...currentInbox.room,
            members: [...currentInbox.room.members, member],
          },
        });
        currentInbox.room.members.push(member);
        toast.success(`Add ${member.nickname} to group success`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-2">Add members</DialogTitle>
          <DialogDescription>Add friends to group</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            {friendList.length > 0 ? (
              friendList
                .sort((a, b) => b.profile.id - a.profile.id)
                .map((friend) => (
                  <div
                    key={friend.profile.id}
                    className={`w-full flex items-center justify-between space-x-4 p-2 rounded-xl`}
                  >
                    <div className="flex space-x-4">
                      <UserAvatar
                        avatar={friend.profile.avatar}
                        name={friend.profile.nickname}
                      />
                      <div>
                        <div className="font-semibold">
                          {friend.profile.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {friend.profile.mobile}
                        </div>
                      </div>
                    </div>
                    {!currentInbox.room.members.some(
                      (member) => member.id === friend.profile.id
                    ) && (
                      <Button
                        size={"sm"}
                        onClick={() => handleAddMember(friend.profile)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-center">Empty friends</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupAddMemberModal;
