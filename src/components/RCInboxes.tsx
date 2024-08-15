import { getInboxes } from "@/api/inbox";
import { Inbox } from "@/types/api";
import { useEffect, useState } from "react";
import RCInboxCard from "./RCInboxCard";

const RCInboxes = () => {
  const [inboxes, setInboxes] = useState<Inbox[]>([]);

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

  return (
    <div className="felx flex-col space-y-2 ">
      {inboxes.map((inbox) => (
        <RCInboxCard key={inbox.id} inbox={inbox} />
      ))}
    </div>
  );
};

export default RCInboxes;
