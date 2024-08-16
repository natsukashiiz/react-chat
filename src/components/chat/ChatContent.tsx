import { Inbox, Message, Profile } from "@/types/api";
import ChatMessage from "./ChatMessage";

interface ChatContentProps {
  contentRef: React.RefObject<HTMLDivElement>;
  rooms: Map<number, Inbox>;
  messages: Message[];
  profile: Profile | null;
  curInbox: Inbox | null;
}
const ChatContent = ({
  rooms,
  contentRef,
  profile,
  curInbox,
}: ChatContentProps) => {
  const currentInbox = rooms.get(curInbox?.id || 0);
  console.log("currentInbox", currentInbox);

  return (
    <div
      ref={contentRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-2"
    >
      {currentInbox?.room.messages.map((message) => (
        <ChatMessage key={message.id} message={message} profile={profile} />
      ))}
    </div>
  );
};

export default ChatContent;
