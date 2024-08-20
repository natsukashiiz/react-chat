import { create } from "zustand";
import { Message, Inbox, SendMessageBody, TypingMessage } from "@/types/api";
import { MessageAction, MessageType } from "@/types/enum";

interface ChatState {
  inboxList: Inbox[];
  currentInbox: Inbox | null;
  messageList: Message[];
  messageBody: SendMessageBody;
  typing: boolean;
  typingMessage: TypingMessage | null;
  setInboxList: (inboxes: Inbox[]) => void;
  updateInbox: (inbox: Inbox) => void;
  deteteInbox: (inboxId: number) => void;
  setCurrentInbox: (inbox: Inbox) => void;
  setMessageList: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setMessageBody: (body: SendMessageBody) => void;
  setTyping: (typing: boolean) => void;
  setTypingMessage: (typingMessage: TypingMessage) => void;
  clearTypingMessage: () => void;
  clearMessageBody: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  inboxList: [],
  currentInbox: null,
  messageList: [],
  messageBody: {
    action: MessageAction.SendMessage,
    type: MessageType.Text,
    content: "",
  },
  typing: false,
  typingMessage: null,
  setInboxList: (inboxes) => set({ inboxList: inboxes }),
  updateInbox: (inbox) => {
    set((state) => ({
      inboxList: state.inboxList.map((i) =>
        i.room.id === inbox.room.id ? inbox : i
      ),
    }));
  },
  deteteInbox: (inboxId) => {
    set((state) => ({
      inboxList: state.inboxList.filter((i) => i.room.id !== inboxId),
    }));
  },
  setCurrentInbox: (inbox) => set({ currentInbox: inbox }),
  setMessageList: (messages) => set({ messageList: messages }),
  addMessage: (message) => {
    set((state) => ({ messageList: [...state.messageList, message] }));
  },
  setMessageBody: (body) => set({ messageBody: body }),
  setTyping: (typing) => set({ typing }),
  setTypingMessage: (typingMessage) => set({ typingMessage }),
  clearTypingMessage: () => set({ typingMessage: null }),
  clearMessageBody: () =>
    set({
      messageBody: {
        action: MessageAction.SendMessage,
        type: MessageType.Text,
        content: "",
      },
    }),
}));

export default useChatStore;
