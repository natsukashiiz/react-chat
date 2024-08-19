/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import type { Friend, Message, TypingMessage } from "@/types/api";
import useAuthStore from "@/stores/auth";
import { over, type Client } from "stompjs";
import SockJS from "sockjs-client";
import useChatStore from "@/stores/chat";
import { Outlet, useNavigate } from "react-router";
import useFriendStore from "@/stores/friend";
import { getFriends } from "@/api/friend";
import { FriendStatus } from "@/types/enum";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

let stompClient: Client | null = null;
const MainLayout = () => {
  const { token, authenticated } = useAuthStore();
  const {
    inboxList,
    currentInbox,
    updateInbox,
    addMessage,
    setCurrentInbox,
    typing,
    setTypingMessage,
    clearTypingMessage,
  } = useChatStore();
  const { setFriendList, addFriendList } = useFriendStore();

  const stompClientRef = useRef<Client | null>(null);
  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const nagivation = useNavigate();

  useEffect(() => {
    if (authenticated) {
      const loadFriends = async () => {
        try {
          const res = await getFriends(FriendStatus.Apply);
          if (res.status === 200 && res.data) {
            setFriendList(res.data.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadFriends();
    }
  }, [authenticated]);

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

          stompClientRef.current?.subscribe(
            "/user/topic/friends",
            (message) => {
              toast("You have a new friend request", {
                action: {
                  label: "View",
                  onClick: () => {
                    nagivation("/friends");
                  },
                },
              });
              const friend = JSON.parse(message.body) as Friend;
              addFriendList(friend);
            }
          );

          stompClientRef.current?.subscribe("/user/topic/typing", (message) => {
            const typing = JSON.parse(message.body) as TypingMessage;
            setTypingMessage(typing);
          });
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
    if (typing) {
      stompClientRef.current?.send(
        "/app/typing",
        {},
        JSON.stringify({ roomId: currentInbox?.room.id })
      );
    }
  }, [typing]);

  useEffect(() => {
    if (newMessage) {
      let upUnreadCount;
      if (currentInbox && currentInbox.room.id === newMessage.room.id) {
        addMessage(newMessage);
        upUnreadCount = 0;
        clearTypingMessage();
      } else {
        upUnreadCount = 1;
        toast.message("You have a new message", {
          description: `${newMessage.sender.nickname}: sent you a message`,
          action: {
            label: "View",
            onClick: () => {
              setCurrentInbox(
                inboxList.find((inbox) => inbox.room.id === newMessage.room.id)!
              );
            },
          },
        });
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

  if (authenticated === false) {
    return (
      <p>
        Please login to continue{" "}
        <a href="/login" className="underline">
          login
        </a>
      </p>
    );
  }

  return (
    <div className="w-full h-dvh">
      <Toaster position="top-right" closeButton={true} duration={5000} />
      <Outlet />
    </div>
  );
};

export default MainLayout;
