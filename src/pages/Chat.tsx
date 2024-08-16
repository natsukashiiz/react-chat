/* eslint-disable react-hooks/exhaustive-deps */

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
import { over, type Client } from "stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
const Chat = () => {
  const { profile, clearAuth, token } = useAuthStore();

  const stompClientRef = useRef<Client | null>(null);
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [currentInbox, setCurrentInbox] = useState<Inbox | null>(null);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>("");
  const [pagination, setPagination] = useState({ page: 1, size: 30, total: 0 });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token && !stompClientRef.current) {
      const socket = new SockJS("http://localhost:8080/ws");
      stompClient = over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect(
        { Authorization: `Bearer ${token.accessToken}` },
        () => {
          stompClientRef.current?.subscribe(
            "/user/topic/messages",
            (message) => {
              const newMessage = JSON.parse(message.body);
              setNewMessage(newMessage);
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
    }

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect(() => {
          console.log("Stomp client disconnected");
        });
        stompClientRef.current = null;
      }
    };
  }, [token]);

  useEffect(() => {
    if (newMessage) {
      if (currentInbox && currentInbox.room.id === newMessage.room.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        const newInboxes = inboxes.map((inbox) => {
          if (inbox.room.id === newMessage.room.id) {
            return {
              ...inbox,
              lastMessage: newMessage,
              unreadCount: inbox.unreadCount + 1,
            };
          }
          return inbox;
        });
        setInboxes(newInboxes);
      }
    }
  }, [newMessage]);

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
          setInboxes(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadInboxes();
  }, []);

  useEffect(() => {
    if (currentInbox) {
      const loadMessages = async () => {
        try {
          const res = await getMessages(currentInbox.room.id, {
            page: pagination.page,
            size: pagination.size,
          });
          if (res.status === 200 && res.data) {
            setMessages(res.data.data.messages.reverse());

            setPagination({
              ...pagination,
              total: res.data.data.messageCount!,
            });

            // update inbox unread count
            const newInboxes = inboxes.map((inbox) => {
              if (inbox.id === currentInbox.id) {
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
  }, [currentInbox]);

  const handleSendMessage = async () => {
    if (currentInbox && content.trim() !== "") {
      try {
        const res = await sendMessage(currentInbox.room.id, {
          type: MessageType.Text,
          content,
        });
        if (res.status === 200 && res.data) {
          setMessages((prevMessages) => [...prevMessages, res.data.data]);
          setContent("");

          //   update inbox last message
          const newInboxes = inboxes.map((inbox) => {
            if (inbox.id === currentInbox.id) {
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
            inboxes={inboxes}
            currentInbox={currentInbox}
            setCurrentInbox={setCurrentInbox}
            profile={profile}
            handleLogout={handleLogout}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatLayout
            contentRef={messagesContainerRef}
            currentInbox={currentInbox}
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
