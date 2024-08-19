import { MessageAction, MessageType } from "@/types/enum";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ReplyIcon, FileIcon } from "lucide-react";

interface ChatMessageBoxProps {
  action: MessageAction;
  type: MessageType;
  content: string;
  isMe: boolean;
  bgColor?: string;
  handleReplyMessage: () => void;
}
const ChatMessageBox = ({
  action,
  type,
  content,
  isMe,
  bgColor = "bg-white",
  handleReplyMessage,
}: ChatMessageBoxProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex space-x-1 items-center">
          {isMe && (
            <ReplyIcon
              className="w-4 h-4 cursor-pointer hover:text-gray-500 scale-x-[-1]"
              onClick={handleReplyMessage}
            />
          )}
          <div
            className={`max-w-xs ${bgColor} shadow-xl rounded-xl overflow-hidden
        ${type === MessageType.Text ? "px-4 py-1" : "p-0"} 
        ${type === MessageType.Image ? "cursor-pointer" : ""}`}
          >
            {type === MessageType.Text ? (
              <span>{content}</span>
            ) : type === MessageType.Image ? (
              <PhotoProvider>
                <PhotoView src={content}>
                  <img src={content} alt="image" />
                </PhotoView>
              </PhotoProvider>
            ) : type === MessageType.Audio ? (
              <audio controls>
                <source src={content} type="audio/mp3" />
              </audio>
            ) : type === MessageType.Video ? (
              <video controls>
                <source src={content} type="video/mp4" />
              </video>
            ) : type === MessageType.File ? (
              <a href={content} download target="_blank">
                <FileIcon className="w-10 h-10" />
              </a>
            ) : (
              <span>({type})</span>
            )}
          </div>
          {!isMe && (
            <ReplyIcon
              className="w-4 h-4 cursor-pointer hover:text-gray-500"
              onClick={handleReplyMessage}
            />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleReplyMessage}>Reply</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ChatMessageBox;
