import { Message, Profile } from "@/types/api";
import { MessageAction, MessageType } from "@/types/enum";
import { Badge } from "../ui/badge";
import UserAvatar from "../UserAvatar";

const ChatMessageAction = ({ sender, action, content, mention }: Message) => {
  return (
    <div
      className={`flex items-center justify-center space-x-2 my-1 w-full p-2`}
    >
      <Badge variant="outline">
        {action === MessageAction.CreateGroupChat ? (
          <span>{`${sender.nickname} created group chat`}</span>
        ) : action === MessageAction.RenameGroupChat ? (
          <span>{`${sender.nickname} renamed group chat to "${content}"`}</span>
        ) : action === MessageAction.ChangeGroupChatPhoto ? (
          <span>{`${sender.nickname} changed group chat photo`}</span>
        ) : action === MessageAction.RemoveGroupMember ? (
          <span>{`${sender.nickname} removed ${mention.nickname}`}</span>
        ) : action === MessageAction.AddGroupMember ? (
          <span>{`${sender.nickname} added ${mention.nickname}`}</span>
        ) : action === MessageAction.LeaveChat ? (
          <span>{`${sender.nickname} left the chat`}</span>
        ) : action === MessageAction.JoinChat ? (
          <span>{`${sender.nickname} joined the chat`}</span>
        ) : (
          <span>({action})</span>
        )}
      </Badge>
    </div>
  );
};

const ChatMessageContent = ({ content, type }: Message) => {
  return (
    <div className={`${type === MessageType.Text ? "p-3" : "p-0"}`}>
      {type === MessageType.Text ? (
        <span>{content}</span>
      ) : type === MessageType.Image ? (
        <img src={content} alt="image" className="w-40 h-40 object-cover" />
      ) : type === MessageType.Audio ? (
        <audio controls>
          <source src={content} type="audio/mp3" />
        </audio>
      ) : type === MessageType.Video ? (
        <video controls>
          <source src={content} type="video/mp4" />
        </video>
      ) : type === MessageType.File ? (
        <a href={content} download>
          Download File
        </a>
      ) : (
        <span>({type})</span>
      )}
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  profile: Profile | null;
}
const ChatMessage = ({ message, profile }: ChatMessageProps) => {
  return message.action === MessageAction.SendMessage ? (
    <div
      key={message.id}
      className={`flex items-center space-x-2 my-1 w-full p-2 rounded-lg ${
        message.sender.id === profile?.id ? "justify-end" : ""
      }`}
    >
      {message.sender.id !== profile?.id && (
        <UserAvatar
          avatar={message.sender.avatar}
          name={message.sender.nickname}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="bg-accent rounded-md max-w-xs">
        <ChatMessageContent {...message} />
      </div>
    </div>
  ) : message.action === MessageAction.ReplyMessage ? (
    <div
      key={message.id}
      className={`flex items-center space-x-2 my-1 w-full p-2 rounded-lg ${
        message.sender.id === profile?.id ? "justify-end" : ""
      }`}
    >
      {message.sender.id !== profile?.id && (
        <UserAvatar
          avatar={message.sender.avatar}
          name={message.sender.nickname}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex flex-col space-y-1">
        <span className="text-xs">Reply message</span>
        <div className="bg-blue-100 p-3 rounded-md max-w-xs">
          {message.replyTo.action === MessageAction.SendMessage ? (
            <div>{message.replyTo.content}</div>
          ) : (
            <ChatMessageAction {...message} />
          )}
        </div>
        <div className="bg-accent p-3 rounded-md max-w-xs">
          <div>{message.content}</div>
        </div>
      </div>
    </div>
  ) : (
    <ChatMessageAction {...message} />
  );
};

export default ChatMessage;
