import InboxBottom from "./InboxBottom";
import InboxContent from "./InboxContent";
import InboxHeader from "./InboxHeader";

const InboxLayout = () => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <InboxHeader />
      <InboxContent />
      <InboxBottom />
    </div>
  );
};

export default InboxLayout;
