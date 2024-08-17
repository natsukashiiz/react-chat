import ChatBottom from "./ChatBottom";
import ChatContent from "./ChatContent";
import ChatHeader from "./ChatHeader";

const ChatLayout = () => {
  return (
    <div className="flex flex-col justify-between w-full h-full relative">
      <ChatHeader />
      <ChatContent />
      <ChatBottom />
    </div>
  );
};

export default ChatLayout;
