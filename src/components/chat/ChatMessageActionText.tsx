import { Message } from "@/types/api";
import { MessageAction } from "@/types/enum";

const ChatMessageActionText = ({ action, content, mention }: Message) => {
  return (
    <>
      {action === MessageAction.CreateGroupChat
        ? `created group chat`
        : action === MessageAction.RenameGroupChat
        ? `renamed group chat to "${content}"`
        : action === MessageAction.ChangeGroupChatPhoto
        ? `changed group chat photo`
        : action === MessageAction.RemoveGroupMember && mention
        ? `removed ${mention.nickname}`
        : action === MessageAction.AddGroupMember && mention
        ? `added ${mention.nickname}`
        : action === MessageAction.LeaveChat
        ? `left the chat`
        : action === MessageAction.JoinChat
        ? `joined the chat`
        : { action }}
    </>
  );
};

export default ChatMessageActionText;
