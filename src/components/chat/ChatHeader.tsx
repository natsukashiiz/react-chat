import { RoomType } from "@/types/enum";
import { Button } from "../ui/button";
import useChatStore from "@/stores/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import UserInfoModal from "../UserInfoModal";
import GroupInfoModal from "../GroupInfoModal";

const ChatHeader = () => {
  const { currentInbox } = useChatStore();

  const [isOpenUserInfo, setIsOpenUserInfo] = useState(false);
  const [isOpenGroupInfo, setIsOpenGroupInfo] = useState(false);

  return (
    <>
      {currentInbox && currentInbox.room.friend && (
        <UserInfoModal
          isOpen={isOpenUserInfo}
          onClose={() => setIsOpenUserInfo(false)}
          friend={currentInbox.room.friend}
        />
      )}
      {currentInbox && currentInbox.room.type === RoomType.Group && (
        <GroupInfoModal
          isOpen={isOpenGroupInfo}
          onClose={() => setIsOpenGroupInfo(false)}
          group={currentInbox.room}
        />
      )}
      <div className="w-full h-20 px-6 flex justify-between items-center border-b">
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">
            {currentInbox ? currentInbox.room.name : "Select Inbox"}
          </span>
          {currentInbox && currentInbox.room.type == RoomType.Friend ? (
            <span className="text-xs">
              Last seen {currentInbox.room.friend.profile.lastSeenAt.toString()}
            </span>
          ) : currentInbox && currentInbox.room.type == RoomType.Group ? (
            <span className="text-xs">
              {currentInbox.room.members.length} members
            </span>
          ) : (
            ""
          )}
        </div>
        {currentInbox && (
          <div className="flex space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant="ghost">
                  <EllipsisVerticalIcon size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                {currentInbox.room.type == RoomType.Group ? (
                  <DropdownMenuItem onClick={() => setIsOpenGroupInfo(true)}>
                    View group
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsOpenUserInfo(true)}>
                    View profile
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHeader;
