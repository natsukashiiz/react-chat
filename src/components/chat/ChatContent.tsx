import useChatStore from "@/stores/chat";
import ChatMessage from "./ChatMessage";
import { getMessages } from "@/api/message";
import { MessageAction, MessageType } from "@/types/enum";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const ChatContent = () => {
  const {
    messageList,
    setMessageBody,
    setMessageList,
    currentInbox,
    updateInbox,
    typingMessage,
    clearTypingMessage,
  } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isTop, setIsTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      setIsTop(chatContainerRef.current.scrollTop === 0);

      const scrollDiff =
        chatContainerRef.current.scrollHeight -
        chatContainerRef.current.scrollTop;

      if (scrollDiff > 800) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleScrollToBottom = () => {
    chatContainerRef.current?.style.setProperty("scroll-behavior", "smooth");
    scrollToBottom();

    setTimeout(() => {
      chatContainerRef.current?.style.setProperty("scroll-behavior", "auto");
    }, 0);
  };

  useEffect(() => {
    if (messageList.length > 0 && pagination.page === 1) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messageList]);

  useEffect(() => {
    setPagination({ page: 1, size: 20, total: 0 });
    setMessageList([]);
    setIsTop(false);

    if (currentInbox) {
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const res = await getMessages(currentInbox.room.id, {
            page: pagination.page,
            size: pagination.size,
          });
          if (res.status === 200 && res.data) {
            updateInbox({
              ...currentInbox,
              unreadCount: 0,
            });

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
        setIsLoading(false);
      };
      loadMessages();
    }
  }, [currentInbox]);

  useEffect(() => {
    if (currentInbox) {
      const loadMessages = async () => {
        if (chatContainerRef.current) {
          // Capture the current scroll position
          const currentScrollHeight = chatContainerRef.current.scrollHeight;
          const currentScrollTop = chatContainerRef.current.scrollTop;

          setIsLoading(true);
          try {
            const res = await getMessages(currentInbox.room.id, {
              page: pagination.page,
              size: pagination.size,
            });
            if (res.status === 200 && res.data) {
              setMessageList([
                ...res.data.data.messages.reverse(),
                ...messageList,
              ]);

              setPagination({
                ...pagination,
                total: res.data.data.messageCount!,
              });

              setIsTop(false);

              // Adjust the scroll position to maintain the user's view
              setTimeout(() => {
                if (chatContainerRef.current) {
                  chatContainerRef.current.scrollTop =
                    chatContainerRef.current.scrollHeight -
                    currentScrollHeight +
                    currentScrollTop;
                }
              }, 0);

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
          setIsLoading(false);
        }
      };
      loadMessages();
    }
  }, [pagination.page]);

  useEffect(() => {
    if (isTop && pagination.page * pagination.size < pagination.total) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isTop]);

  useEffect(() => {
    if (
      currentInbox &&
      typingMessage &&
      currentInbox.room.id === typingMessage.roomId
    ) {
      if (
        chatContainerRef.current &&
        chatContainerRef.current.scrollTop +
          chatContainerRef.current.clientHeight >=
          chatContainerRef.current.scrollHeight - 100
      ) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }

      setTimeout(() => {
        clearTypingMessage();
      }, 2000);
    }
  }, [typingMessage]);

  return (
    currentInbox && (
      <>
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-4"
          style={{
            backgroundImage: "url('/chat-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isLoading && <span className="text-center pt-5">Loading...</span>}
          {messageList.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {currentInbox &&
            typingMessage &&
            currentInbox.room.id === typingMessage.roomId && (
              <ChatMessage
                message={{
                  id: 0,
                  action: MessageAction.SendMessage,
                  type: MessageType.Text,
                  content: "Typing...",
                  sender: typingMessage.user,
                  createdAt: new Date(),
                  room: currentInbox.room,
                  mention: null,
                  replyTo: null,
                }}
              />
            )}
        </div>
        {showScrollToBottom && (
          <div
            className="absolute bottom-20 right-6 animate-slide-in cursor-pointer bg-white shadow-xl rounded-full h-10 w-10"
            onClick={handleScrollToBottom}
          >
            <ChevronDownIcon className="w-full h-full" strokeWidth={1.2} />
          </div>
        )}
      </>
    )
  );
};

export default ChatContent;
