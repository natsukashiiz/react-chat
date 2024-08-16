import type { Inbox, Profile } from "@/types/api";
import InboxBottom from "./InboxBottom";
import InboxContent from "./InboxContent";
import InboxHeader from "./InboxHeader";

interface InboxProps {
  rooms: Map<number, Inbox>;
  curInbox: Inbox | null;
  setCurInbox: (inbox: Inbox) => void;
  profile: Profile | null;
  handleLogout: () => void;
}
const InboxLayout = ({
  rooms,
  curInbox,
  setCurInbox,
  profile,
  handleLogout,
}: InboxProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <InboxHeader />
      <InboxContent
        rooms={rooms}
        curInbox={curInbox}
        setCurInbox={setCurInbox}
      />
      {profile && <InboxBottom profile={profile} handleLogout={handleLogout} />}
    </div>
  );
};

export default InboxLayout;
