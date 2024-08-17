import { RoomType } from "@/types/enum";
import { Button } from "../ui/button";
import useChatStore from "@/stores/chat";

const ChatHeader = () => {
  const { currentInbox } = useChatStore();
  return (
    <div className="w-full h-20 px-4 flex justify-between items-center border-b">
      <div className="flex flex-col space-y-1">
        <span className="font-semibold">
          {currentInbox ? currentInbox.room.name : "Select Inbox"}
        </span>
        {currentInbox && currentInbox.room.type == RoomType.Friend ? (
          <span className="text-xs">
            Last seen {currentInbox.room.friend.lastSeenAt.toString()}
          </span>
        ) : currentInbox && currentInbox.room.type == RoomType.Group ? (
          <span className="text-xs">
            {currentInbox.room.members.length} members
          </span>
        ) : (
          ""
        )}
      </div>
      <div className="flex space-x-1">
        <Button size={"sm"}>Actions</Button>
      </div>
    </div>
  );
};

export default ChatHeader;
