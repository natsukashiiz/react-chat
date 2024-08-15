import { getInboxes } from "@/api/inbox";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Message } from "@/types/api";
import { getMessages, sendMessage } from "@/api/message";
import { MessageType, RoomType } from "@/types/enum";
import useProfileStore from "@/stores/profile";

const Chat = () => {
  const { profile } = useProfileStore();
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [curInbox, setCurInbox] = useState<Inbox | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>("");
  const [pagination, setPagination] = useState({ page: 1, size: 30, total: 0 });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const loadInboxes = async () => {
      try {
        const res = await getInboxes();
        if (res.status === 200 && res.data) {
          setInboxes([...res.data.data]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadInboxes();
  }, []);

  useEffect(() => {
    if (curInbox) {
      const loadMessages = async () => {
        try {
          const res = await getMessages(curInbox.room.id, {
            page: pagination.page,
            size: pagination.size,
          });
          if (res.status === 200 && res.data) {
            setMessages([...res.data.data.messages.reverse()]);

            setPagination({
              ...pagination,
              total: res.data.data.messageCount!,
            });

            // update inbox unread count
            const newInboxes = inboxes.map((inbox) => {
              if (inbox.id === curInbox.id) {
                return {
                  ...inbox,
                  unreadCount: 0,
                };
              }
              return inbox;
            });
            setInboxes(newInboxes);
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadMessages();
    }
  }, [curInbox]);

  const handleSendMessage = async () => {
    if (curInbox) {
      try {
        const res = await sendMessage(curInbox.room.id, {
          type: MessageType.Text,
          content,
        });
        if (res.status === 200 && res.data) {
          setMessages([...messages, res.data.data]);
          setContent("");

          // update inbox last message
          const newInboxes = inboxes.map((inbox) => {
            if (inbox.id === curInbox.id) {
              return {
                ...inbox,
                lastMessage: res.data.data,
              };
            }
            return inbox;
          });
          setInboxes(newInboxes);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-dvh">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full border"
      >
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <div className="border-b w-full flex justify-between items-center h-20 px-4">
            <span className="font-semibold">Inboxes</span>
            <div className="flex space-x-1">
              <Button size={"sm"}>Groups</Button>
              <Button size={"sm"} asChild>
                <Link to="/friends">Friends</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col h-full items-center p-6">
            {inboxes.length > 0 ? (
              inboxes.map((inbox) => (
                <div
                  key={inbox.id}
                  className={`flex items-center space-x-2 my-1 w-full p-2 hover:bg-accent rounded-lg cursor-pointer ${
                    inbox.room.id === curInbox?.room.id
                      ? "bg-accent"
                      : inbox.unreadCount > 0
                      ? "bg-rose-100"
                      : ""
                  }`}
                  onClick={() => setCurInbox(inbox)}
                >
                  <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage
                      src={inbox.room.image!}
                      alt={inbox.room.name!}
                    />
                    <AvatarFallback>
                      {inbox.room.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {inbox.room.name}{" "}
                      {inbox.unreadCount > 0 &&
                        `(${
                          inbox.unreadCount > 99 ? "99+" : inbox.unreadCount
                        })`}
                    </div>
                    {inbox.lastMessage ? (
                      <div className="truncate text-ellipsis w-72">
                        {inbox.lastMessage.content}
                      </div>
                    ) : (
                      <div>No messages</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">Empty inboxes</div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col justify-between w-full h-full">
            <div className="w-full h-20 flex p-5 justify-between items-center border-b">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">
                  {curInbox ? curInbox.room.name : "Select Inbox"}
                </span>
                {curInbox && curInbox.room.type == RoomType.Friend && (
                  <span className="text-xs">
                    Last seen {curInbox.room.friend.lastSeenAt.toString()}
                  </span>
                )}
              </div>
              <div className="flex space-x-1">
                <Button size={"sm"}>Actions</Button>
              </div>
            </div>
            <div
              ref={messagesContainerRef}
              className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-2"
            >
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-center space-x-2 my-1 w-full p-2 rounded-lg ${
                      message.sender.id === profile?.id ? "justify-end" : ""
                    }`}
                  >
                    {message.sender.id !== profile?.id && (
                      <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage
                          src={message.sender.avatar}
                          alt={message.sender.nickname}
                        />
                        <AvatarFallback>
                          {message.sender.nickname?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="bg-accent p-3 rounded-md max-w-xs">
                      <div>{message.content}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">No messages</div>
              )}
            </div>
            {curInbox && (
              <div className="p-2 flex justify-between w-full items-center gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyUp={handleKeyPress}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Type a message..."
                />
                <Button onClick={() => handleSendMessage()}>Send</Button>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
