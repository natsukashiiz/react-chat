import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const InboxHeader = () => {
  return (
    <div className="w-full h-20 px-4 flex justify-between items-center border-b">
      <span className="font-semibold">Inbox</span>
      <div className="flex space-x-1">
        <Button size={"sm"}>Groups</Button>
        <Button size={"sm"} asChild>
          <Link to="/friends">Friends</Link>
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
