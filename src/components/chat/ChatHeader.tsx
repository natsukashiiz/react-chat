import { Inbox } from "@/types/api";
import { RoomType } from "@/types/enum";
import { Button } from "../ui/button";

interface ChatHeaderProps {
  curInbox: Inbox | null;
}
const ChatHeader = ({ curInbox }: ChatHeaderProps) => {
  return (
    <div className="w-full h-20 px-4 flex justify-between items-center border-b">
      <div className="flex flex-col space-y-1">
        <span className="font-semibold">
          {curInbox ? curInbox.room.name : "Select Inbox"}
        </span>
        {curInbox && curInbox.room.type == RoomType.Friend ? (
          <span className="text-xs">
            Last seen {curInbox.room.friend.lastSeenAt.toString()}
          </span>
        ) : curInbox && curInbox.room.type == RoomType.Group ? (
          <span className="text-xs">
            {curInbox.room.members.length} members
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
