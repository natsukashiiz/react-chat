import { Inbox } from "@/types/api";
import InboxItem from "./InboxItem";

interface InboxContentProps {
  rooms: Map<number, Inbox>;
  curInbox: Inbox | null;
  setCurInbox: (inbox: Inbox) => void;
}
const InboxContent = ({ rooms, curInbox, setCurInbox }: InboxContentProps) => {
  return (
    <div className="flex flex-col h-full items-center p-6 w-full overflow-y-auto overflow-x-hidden">
      {[...rooms].map(([key, value]) => (
        <InboxItem
          key={key}
          inbox={value}
          curInbox={curInbox}
          setCurInbox={setCurInbox}
        />
      ))}
    </div>
  );
};

export default InboxContent;
