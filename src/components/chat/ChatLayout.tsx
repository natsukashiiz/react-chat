import { Inbox, Message, Profile } from "@/types/api";
import ChatBottom from "./ChatBottom";
import ChatContent from "./ChatContent";
import ChatHeader from "./ChatHeader";

interface ChatProps {
  contentRef: React.RefObject<HTMLDivElement>;
  rooms: Map<number, Inbox>;
  curInbox: Inbox | null;
  messages: Message[];
  profile: Profile | null;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const ChatLayout = ({
  contentRef,
  rooms,
  curInbox,
  messages,
  profile,
  content,
  setContent,
  handleSendMessage,
  handleKeyPress,
}: ChatProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatHeader curInbox={curInbox} />
      <ChatContent
        contentRef={contentRef}
        rooms={rooms}
        messages={messages}
        profile={profile}
        curInbox={curInbox}
      />
      {curInbox && (
        <ChatBottom
          content={content}
          setContent={setContent}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
      )}
    </div>
  );
};

export default ChatLayout;
