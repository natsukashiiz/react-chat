import { Inbox, Message, Profile } from "@/types/api";
import ChatBottom from "./ChatBottom";
import ChatContent from "./ChatContent";
import ChatHeader from "./ChatHeader";

interface ChatProps {
  contentRef: React.RefObject<HTMLDivElement>;
  currentInbox: Inbox | null;
  messages: Message[];
  profile: Profile | null;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const ChatLayout = ({
  contentRef,
  currentInbox,
  messages,
  profile,
  content,
  setContent,
  handleSendMessage,
  handleKeyPress,
}: ChatProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatHeader currentInbox={currentInbox} />
      <ChatContent
        contentRef={contentRef}
        messages={messages}
        profile={profile}
      />
      {currentInbox && (
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
