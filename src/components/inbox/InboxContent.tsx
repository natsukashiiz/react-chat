import { Inbox } from "@/types/api";
import InboxItem from "./InboxItem";

interface InboxContentProps {
  inboxes: Inbox[];
  curInbox: Inbox | null;
  setCurInbox: (inbox: Inbox) => void;
}
const InboxContent = ({
  inboxes,
  curInbox,
  setCurInbox,
}: InboxContentProps) => {
  return (
    <div className="flex flex-col h-full items-center p-6 w-full overflow-y-auto overflow-x-hidden">
      {inboxes.length > 0 ? (
        inboxes.map((inbox) => (
          <InboxItem
            key={inbox.id}
            inbox={inbox}
            curInbox={curInbox}
            setCurInbox={setCurInbox}
          />
        ))
      ) : (
        <div className="text-center">No inbox</div>
      )}
    </div>
  );
};

export default InboxContent;
