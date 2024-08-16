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

const Chat = () => {
  const { profile, clearAuth } = useAuthStore();

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
