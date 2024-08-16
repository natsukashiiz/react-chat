import type { Inbox, Profile } from "@/types/api";
import InboxBottom from "./InboxBottom";
import InboxContent from "./InboxContent";
import InboxHeader from "./InboxHeader";

interface InboxProps {
  inboxes: Inbox[];
  curInbox: Inbox | null;
  setCurInbox: (inbox: Inbox) => void;
  profile: Profile | null;
  handleLogout: () => void;
}
const InboxLayout = ({
  inboxes,
  curInbox,
  setCurInbox,
  profile,
  handleLogout,
}: InboxProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <InboxHeader />
      <InboxContent
        inboxes={inboxes}
        curInbox={curInbox}
        setCurInbox={setCurInbox}
      />
      {profile && <InboxBottom profile={profile} handleLogout={handleLogout} />}
    </div>
  );
};

export default InboxLayout;
