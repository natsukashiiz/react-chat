import { Message } from "@/types/api";
import { Badge } from "../ui/badge";
import ChatMessageActionText from "./ChatMessageActionText";

const ChatMessageAction = (message: Message) => {
  return (
    <div
      className={`flex items-center justify-center space-x-2 my-1 w-full p-2`}
    >
      <Badge variant={"outline"} className="bg-white text-black">
        <span>{message.sender.nickname}</span>
        {": "}
        <ChatMessageActionText {...message} />
      </Badge>
    </div>
  );
};

export default ChatMessageAction;
