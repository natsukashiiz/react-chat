import { Inbox } from "@/types/api";
import UserAvatar from "../UserAvatar";

interface InboxItemProps {
  inbox: Inbox;
  currentInbox: Inbox | null;
  setCurrentInbox: (inbox: Inbox) => void;
}
const InboxItem = ({
  inbox,
  currentInbox,
  setCurrentInbox,
}: InboxItemProps) => {
  return (
    <div
      key={inbox.id}
      className={`flex items-center space-x-2 my-1 w-full p-2 hover:bg-accent rounded-lg cursor-pointer ${
        inbox.room.id === currentInbox?.room.id
          ? "bg-accent"
          : inbox.unreadCount > 0
          ? "bg-rose-100"
          : ""
      }`}
      onClick={() => setCurrentInbox(inbox)}
    >
      <UserAvatar
        avatar={inbox.room.image!}
        name={inbox.room.name!}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <div className="font-semibold">
          {inbox.room.name}{" "}
          {inbox.unreadCount > 0 &&
            `(${inbox.unreadCount > 99 ? "99+" : inbox.unreadCount})`}
        </div>
        {inbox.lastMessage ? (
          <div className="truncate text-ellipsis w-72">
            {inbox.lastMessage.content}
          </div>
        ) : (
          <div>No messages</div>
        )}
      </div>
    </div>
  );
};

export default InboxItem;
