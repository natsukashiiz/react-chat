import { Message } from "@/types/api";
import { MessageAction } from "@/types/enum";
import { Badge } from "../ui/badge";

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

export default ChatMessageAction;
