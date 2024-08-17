import useChatStore from "@/stores/chat";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";

const ChatContent = () => {
  const { messageList } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div
      ref={chatContainerRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-2"
    >
      {messageList.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatContent;
