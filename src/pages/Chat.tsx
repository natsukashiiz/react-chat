/* eslint-disable react-hooks/exhaustive-deps */

import { getInboxes } from "@/api/inbox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/api";
import { getMessages } from "@/api/message";
import { MessageAction, MessageType } from "@/types/enum";
import useAuthStore from "@/stores/auth";
import InboxLayout from "@/components/inbox/InboxLayout";
import ChatLayout from "@/components/chat/ChatLayout";
import { over, type Client } from "stompjs";
import SockJS from "sockjs-client";
import useChatStore from "@/stores/chat";

let stompClient: Client | null = null;
const Chat = () => {
  const { token } = useAuthStore();
  const {
    inboxList,
    currentInbox,
    updateInbox,
    setMessageBody,
    setMessageList,
    addMessage,
  } = useChatStore();

  const stompClientRef = useRef<Client | null>(null);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [pagination, setPagination] = useState({ page: 1, size: 30, total: 0 });

  useEffect(() => {
    if (token && !stompClientRef.current) {
      const socket = new SockJS("http://192.168.1.99:8080/ws");
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
      let upUnreadCount = 1;
      if (currentInbox && currentInbox.room.id === newMessage.room.id) {
        addMessage(newMessage);
        upUnreadCount = 0;
      }
      const newInbox = inboxList.map((inbox) => {
        if (inbox.room.id === newMessage.room.id) {
          return {
            ...inbox,
            lastMessage: newMessage,
            unreadCount: inbox.unreadCount + upUnreadCount,
          };
        }
        return inbox;
      });

      if (newInbox)
        updateInbox(
          newInbox.find((inbox) => inbox.room.id === newMessage.room.id)!
        );
    }
  }, [newMessage]);

  useEffect(() => {
    if (currentInbox) {
      const loadMessages = async () => {
        try {
          const res = await getMessages(currentInbox.room.id, {
            page: pagination.page,
            size: pagination.size,
          });
          if (res.status === 200 && res.data) {
            setMessageList(res.data.data.messages.reverse());

            setMessageBody({
              action: MessageAction.SendMessage,
              type: MessageType.Text,
              content: "",
            });

            setPagination({
              ...pagination,
              total: res.data.data.messageCount!,
            });

            // update inbox unread count
            // const newInboxes = inboxes.map((inbox) => {
            //   if (inbox.id === currentInbox.id) {
            //     return {
            //       ...inbox,
            //       unreadCount: 0,
            //     };
            //   }
            //   return inbox;
            // });
            // setInboxes(newInboxes);
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadMessages();
    }
  }, [currentInbox]);

  return (
    <div className="h-dvh">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full border"
      >
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <InboxLayout />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatLayout />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
