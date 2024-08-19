import { Message } from "@/types/api";
import { MessageAction, MessageType } from "@/types/enum";
import UserAvatar from "../UserAvatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ChatMessageBox from "./ChatMessageBox";
import ChatMessageAction from "./ChatMessageAction";
import useAuthStore from "@/stores/auth";
import useChatStore from "@/stores/chat";

interface ChatMessageProps {
  message: Message;
}
const ChatMessage = ({ message }: ChatMessageProps) => {
  const { profile } = useAuthStore();
  const { setMessageBody } = useChatStore();

  const isMe = message.sender.id === profile?.id;

  const handleReplyMessage = () => {
    setMessageBody({
      action: MessageAction.ReplyMessage,
      type: MessageType.Text,
      content: "",
      replyTo: message,
    });
  };

  return message.action === MessageAction.SendMessage ? (
    <div
      key={message.id}
      className={`flex items-center space-x-2 my-2 w-full rounded-lg animate-slide-in ${
        isMe ? "justify-end" : ""
      }`}
    >
      {!isMe && (
        <UserAvatar
          avatar={message.sender.avatar}
          name={message.sender.nickname}
          className="w-10 h-10 rounded-full"
        />
      )}
      <ContextMenu>
        <ContextMenuTrigger>
          <ChatMessageBox
            {...message}
            isMe={isMe}
            handleReplyMessage={handleReplyMessage}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleReplyMessage}>Reply</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ) : message.action === MessageAction.ReplyMessage && message.replyTo ? (
    <div
      key={message.id}
      className={`flex items-center space-x-2 my-2 w-full rounded-lg animate-slide-in ${
        isMe ? "justify-end" : ""
      }`}
    >
      {!isMe && (
        <UserAvatar
          avatar={message.sender.avatar}
          name={message.sender.nickname}
          className="w-10 h-10 rounded-full"
        />
      )}
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex flex-col space-y-1">
            <span className="text-xs">Reply message</span>
            <div>
              {message.replyTo.action === MessageAction.SendMessage ||
              message.replyTo.action === MessageAction.ReplyMessage ? (
                <ChatMessageBox
                  {...message.replyTo}
                  isMe={isMe}
                  bgColor="bg-blue-200"
                  handleReplyMessage={handleReplyMessage}
                />
              ) : (
                <ChatMessageAction {...message} />
              )}
            </div>
            <ChatMessageBox
              {...message}
              isMe={isMe}
              handleReplyMessage={handleReplyMessage}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleReplyMessage}>Reply</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ) : (
    <ChatMessageAction {...message} />
  );
};

export default ChatMessage;
