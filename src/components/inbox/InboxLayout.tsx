import type { Inbox, Profile } from "@/types/api";
import InboxBottom from "./InboxBottom";
import InboxContent from "./InboxContent";
import InboxHeader from "./InboxHeader";

interface InboxProps {
  inboxes: Inbox[];
  currentInbox: Inbox | null;
  setCurrentInbox: (inbox: Inbox) => void;
  profile: Profile | null;
  handleLogout: () => void;
}
const InboxLayout = ({
  inboxes,
  currentInbox,
  setCurrentInbox,
  profile,
  handleLogout,
}: InboxProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <InboxHeader />
      <InboxContent
        inboxes={inboxes}
        currentInbox={currentInbox}
        setCurrentInbox={setCurrentInbox}
      />
      {profile && <InboxBottom profile={profile} handleLogout={handleLogout} />}
    </div>
  );
};

export default InboxLayout;
