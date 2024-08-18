import { create } from "zustand";
import { Message, Inbox, SendMessageBody } from "@/types/api";
import { MessageAction, MessageType } from "@/types/enum";

interface ChatState {
  inboxList: Inbox[];
  currentInbox: Inbox | null;
  messageList: Message[];
  messageBody: SendMessageBody;
  setInboxList: (inboxes: Inbox[]) => void;
  updateInbox: (inbox: Inbox) => void;
  setCurrentInbox: (inbox: Inbox) => void;
  setMessageList: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setMessageBody: (body: SendMessageBody) => void;
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
  setInboxList: (inboxes) => set({ inboxList: inboxes }),
  updateInbox: (inbox) => {
    set((state) => ({
      inboxList: state.inboxList.map((i) =>
        i.room.id === inbox.room.id ? inbox : i
      ),
    }));
  },
  setCurrentInbox: (inbox) => set({ currentInbox: inbox }),
  setMessageList: (messages) => set({ messageList: messages }),
  addMessage: (message) => {
    set((state) => ({ messageList: [...state.messageList, message] }));
  },
  setMessageBody: (body) => set({ messageBody: body }),
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
