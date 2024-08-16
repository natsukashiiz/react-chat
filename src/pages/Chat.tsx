import { getInboxes } from "@/api/inbox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";
import type { Inbox, Message } from "@/types/api";
import { getMessages, sendMessage } from "@/api/message";
import { MessageType } from "@/types/enum";
import useAuthStore from "@/stores/auth";
import InboxLayout from "@/components/inbox/InboxLayout";
import ChatLayout from "@/components/chat/ChatLayout";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const Chat = () => {
  const { profile, clearAuth, token } = useAuthStore();

  const [rooms, setRooms] = useState<Map<number, Inbox>>(new Map());
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [curInbox, setCurInbox] = useState<Inbox | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>("");
  const [pagination, setPagination] = useState({ page: 1, size: 30, total: 0 });
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  const [websocketConnected, setWebsocketConnected] = useState<boolean>(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (websocketConnected) return;
    setWebsocketConnected(true);

    let client: Stomp.Client | null = null;

    if (token && stompClient === null) {
      const socket = new SockJS("http://192.168.1.99:8080/ws");
      client = Stomp.over(socket);

      client.connect(
        { Authorization: `Bearer ${token.accessToken}` },
        function (frame) {
          console.log("Connected: " + frame);
          setStompClient(client);

          if (!client) return;

          client?.subscribe("/user/topic/messages", function (message) {
            const newMessage = JSON.parse(message.body) as Message;
            handleReceiveMessage(newMessage);
          });
        },
        function (error) {
          console.error("Connection failed: " + error);
        }
      );
    }

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("Stomp client disconnected");
        });
      }
    };
  }, [token, stompClient]);

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

          for (const inbox of res.data.data) {
            setRooms((prevRoom) => {
              return new Map(prevRoom.set(inbox.room.id, inbox));
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadInboxes();
  }, []);

  useEffect(() => {
    if (curInbox) {
      console.log("ROOM INFO", rooms.get(curInbox.room.id));
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

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

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

  const handleReceiveMessage = (message: Message) => {
    if (rooms.get(message.room.id)) {
      rooms.get(message.room.id)?.room.messages.push(message);
      setRooms(new Map(rooms));
    } else {
      console.log("Handle receive message", message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <div className="h-dvh">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full border"
      >
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <InboxLayout
            rooms={rooms}
            curInbox={curInbox}
            setCurInbox={setCurInbox}
            profile={profile}
            handleLogout={handleLogout}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatLayout
            contentRef={messagesContainerRef}
            rooms={rooms}
            curInbox={curInbox}
            messages={messages}
            profile={profile}
            content={content}
            setContent={setContent}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
