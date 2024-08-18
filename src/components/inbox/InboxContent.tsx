import InboxItem from "./InboxItem";
import { useEffect } from "react";
import { getInboxes } from "@/api/inbox";
import useChatStore from "@/stores/chat";

const InboxContent = () => {
  const { inboxList, setInboxList } = useChatStore();

  useEffect(() => {
    const loadInboxes = async () => {
      try {
        const res = await getInboxes();
        if (res.status === 200 && res.data) {
          setInboxList(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadInboxes();
  }, []);

  return (
    <div className="flex flex-col h-full items-center p-6 w-full overflow-y-auto overflow-x-hidden">
      {inboxList
        .sort((a, b) => {
          if (a.id && b.id) {
            return b.id - a.id;
          }

          return 0;
        })
        .map((inbox) => (
          <InboxItem key={inbox.id} inbox={inbox} />
        ))}
    </div>
  );
};

export default InboxContent;
