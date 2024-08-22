import { Inbox } from "@/types/api";
import UserAvatar from "../UserAvatar";
import { MessageAction, MessageType } from "@/types/enum";
import useChatStore from "@/stores/chat";
import ChatMessageActionText from "../chat/ChatMessageActionText";

interface InboxItemProps {
  inbox: Inbox;
}
const InboxItem = ({ inbox }: InboxItemProps) => {
  const { currentInbox, setCurrentInbox } = useChatStore();

  return (
    <div
      key={inbox.id}
      className={`flex items-center gap-2 p-1 my-1 w-full hover:bg-accent rounded-lg cursor-pointer transition-all duration-300 ${
        inbox.room.id === currentInbox?.room.id
          ? "border-r-4 border-rose-500 bg-accent"
          : inbox.unreadCount > 0
          ? "bg-accent"
          : ""
      }`}
      onClick={() => setCurrentInbox(inbox)}
    >
      <UserAvatar
        avatar={inbox.room.image!}
        name={inbox.room.name!}
        className="w-14 h-14 rounded-full"
      />
      <div>
        <div className="font-semibold">
          {inbox.room.name}{" "}
          {inbox.unreadCount > 0 &&
            `(${inbox.unreadCount > 99 ? "99+" : inbox.unreadCount})`}
        </div>
        {inbox.lastMessage ? (
          <div className="flex flex-col w-full">
            <span className="text-gray-500 line-clamp-1">
              {inbox.lastMessage.sender.nickname}:
            </span>
            <span className="text-gray-500 line-clamp-1">
              {inbox.lastMessage.action === MessageAction.SendMessage ||
              inbox.lastMessage.action === MessageAction.ReplyMessage ? (
                inbox.lastMessage.type === MessageType.Text ? (
                  inbox.lastMessage.content
                ) : inbox.lastMessage.type === MessageType.Image ? (
                  "Send Image"
                ) : inbox.lastMessage.type === MessageType.File ? (
                  "Send File"
                ) : inbox.lastMessage.type === MessageType.Audio ? (
                  "Send Audio"
                ) : inbox.lastMessage.type === MessageType.Video ? (
                  "Send Video"
                ) : (
                  "???"
                )
              ) : (
                <ChatMessageActionText {...inbox.lastMessage} />
              )}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">No messages</span>
        )}
      </div>
    </div>
  );
};

export default InboxItem;
