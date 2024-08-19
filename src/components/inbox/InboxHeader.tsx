import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useFriendStore from "@/stores/friend";

const InboxHeader = () => {
  const { friendList } = useFriendStore();

  return (
    <div className="w-full h-20 px-4 flex flex-wrap justify-between items-center border-b">
      <span className="font-semibold">Inbox</span>
      <div className="flex space-x-1">
        <Button size={"sm"} asChild>
          <Link to="/groups">Groups</Link>
        </Button>
        <Button size={"sm"} asChild>
          <Link to="/friends">
            Friends{" "}
            {friendList.length > 0 &&
              `(${friendList.length > 100 ? "99+" : friendList.length})`}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
