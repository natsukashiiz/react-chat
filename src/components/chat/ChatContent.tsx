import { Message, Profile } from "@/types/api";
import ChatMessage from "./ChatMessage";

interface ChatContentProps {
  contentRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
  profile: Profile | null;
}
const ChatContent = ({ contentRef, messages, profile }: ChatContentProps) => {
  return (
    <div
      ref={contentRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-2"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} profile={profile} />
      ))}
    </div>
  );
};

export default ChatContent;
