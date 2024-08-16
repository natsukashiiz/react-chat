import { Inbox } from "@/types/api";
import InboxItem from "./InboxItem";

interface InboxContentProps {
  inboxes: Inbox[];
  currentInbox: Inbox | null;
  setCurrentInbox: (inbox: Inbox) => void;
}
const InboxContent = ({
  inboxes,
  currentInbox,
  setCurrentInbox,
}: InboxContentProps) => {
  return (
    <div className="flex flex-col h-full items-center p-6 w-full overflow-y-auto overflow-x-hidden">
      {inboxes.map((inbox) => (
        <InboxItem
          key={inbox.id}
          inbox={inbox}
          currentInbox={currentInbox}
          setCurrentInbox={setCurrentInbox}
        />
      ))}
    </div>
  );
};

export default InboxContent;
