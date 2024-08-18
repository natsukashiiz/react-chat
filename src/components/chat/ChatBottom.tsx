import { MessageType, MessageAction } from "@/types/enum";
import { Button } from "../ui/button";
import {
  PaperclipIcon,
  SendHorizontalIcon,
  StickerIcon,
  XIcon,
  FileIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/api/file";
import useChatStore from "@/stores/chat";
import { replyMessage, sendMessage } from "@/api/message";

const ChatBottom = () => {
  const {
    currentInbox,
    updateInbox,
    messageBody,
    setMessageBody,
    clearMessageBody,
    messageList,
    setMessageList,
  } = useChatStore();

  const [sending, setSending] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (currentInbox && messageBody && messageBody.content.trim() !== "") {
      const { action, type, content, replyTo } = messageBody;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res: any;

        if (action === MessageAction.SendMessage) {
          res = await sendMessage(currentInbox.room.id, {
            action,
            type,
            content,
          });
        } else if (action === MessageAction.ReplyMessage && replyTo) {
          res = await replyMessage(currentInbox.room.id, {
            content,
            type,
            replyToId: replyTo.id,
          });
        }

        if (res.status === 200 && res.data) {
          setMessageBody({
            action: MessageAction.SendMessage,
            type: MessageType.Text,
            content: "",
          });
          setMessageList([...messageList, res.data.data]);

          updateInbox({
            ...currentInbox,
            lastMessage: {
              ...res.data.data,
              sender: {
                id: res.data.data.sender.id,
                nickname: res.data.data.sender.nickname,
              },
            },
          });
        }
      } catch (error) {
        console.error(error);
      }

      setSending(false);
    }
  };

  useEffect(() => {
    if (sending) {
      console.log("sending", messageBody);
      setShowEmojiPicker(false);
      handleSendMessage();
    }
  }, [sending]);

  const onSend = () => {
    setSending(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
    setShowEmojiPicker(false);
  };

  const detectMessageType = (content: string) => {
    if (content.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
      return MessageType.Image;
    } else if (content.match(/\.(mp3|wav|ogg|flac)$/) !== null) {
      return MessageType.Audio;
    } else if (content.match(/\.(mp4|webm|ogg|flv)$/) !== null) {
      return MessageType.Video;
    } else {
      return MessageType.File;
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await uploadFile(formData);
        if (res.status === 200 && res.data) {
          setMessageBody({
            ...messageBody,
            type: detectMessageType(res.data.data.url),
            content: res.data.data.url,
          });
          setSending(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    currentInbox && (
      <div className="p-2 flex justify-between w-full items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,video/*,application/pdf,application/zip,text/plain"
          id="file"
          className="hidden"
          onChange={handleUploadFile}
        />

        {showEmojiPicker && (
          <div
            className={`absolute ${
              messageBody.replyTo ? "bottom-24" : "bottom-12"
            }`}
          >
            <EmojiPicker
              emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis={true}
              onEmojiClick={({ emoji }) =>
                setMessageBody({
                  ...messageBody,
                  content: messageBody.content + emoji,
                })
              }
            />
          </div>
        )}

        <Button size={"icon"} variant={"ghost"} onClick={handleFileClick}>
          <PaperclipIcon />
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <StickerIcon />
        </Button>
        <div className="w-full">
          {messageBody.action === MessageAction.ReplyMessage && (
            <div className="w-full px-4 py-2 bg-white border border-b-0 rounded-lg rounded-b-none flex justify-between items-center animate-slide-in">
              {messageBody.replyTo && (
                <div className="flex space-x-1">
                  <span>{messageBody.replyTo.sender.nickname}: </span>
                  <div>
                    {messageBody.replyTo.type === MessageType.Text ? (
                      <span>{messageBody.replyTo.content}</span>
                    ) : messageBody.replyTo.type === MessageType.Image ? (
                      <img
                        src={messageBody.replyTo.content}
                        alt="image"
                        className="w-8 h-8 object-cover"
                      />
                    ) : messageBody.replyTo.type === MessageType.Audio ? (
                      <audio controls>
                        <source
                          src={messageBody.replyTo.content}
                          type="audio/mp3"
                        />
                      </audio>
                    ) : messageBody.replyTo.type === MessageType.Video ? (
                      <video controls>
                        <source
                          src={messageBody.replyTo.content}
                          type="video/mp4"
                        />
                      </video>
                    ) : messageBody.replyTo.type === MessageType.File ? (
                      <FileIcon className="w-4 h-4" />
                    ) : (
                      <span>({messageBody.replyTo.type})</span>
                    )}
                  </div>
                </div>
              )}
              <XIcon
                fill="white"
                className="w-4 h-4 cursor-pointer hover:text-gray-500"
                onClick={clearMessageBody}
              />
            </div>
          )}
          <Input
            type="text"
            value={
              messageBody.type === MessageType.Text ? messageBody.content : ""
            }
            onChange={(e) =>
              setMessageBody({ ...messageBody, content: e.target.value })
            }
            onKeyUp={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg focus-visible:ring-0 ${
              messageBody.replyTo && "border-t-0 rounded-t-none"
            } `}
            placeholder="Type a message..."
          />
        </div>
        <Button
          size={"icon"}
          onClick={onSend}
          disabled={messageBody.content.trim() === ""}
        >
          <SendHorizontalIcon className="w-6 h-6" />
        </Button>
      </div>
    )
  );
};

export default ChatBottom;
