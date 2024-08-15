import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Inbox } from "@/types/api";
import { MessageAction, MessageType } from "@/types/enum";
import useRoomStore from "@/stores/room";
import RCRoomProfile from "./RCRoomProfile";

const RCInboxCard = ({ inbox }: { inbox: Inbox }) => {
  const { setCurrentRoom } = useRoomStore();
  const { room, lastMessage } = inbox;

  const handleClick = (room: Inbox["room"]) => {
    console.log("handleCardClick", room);
    setCurrentRoom(room);
  };

  return (
    <Card
      className="cursor-pointer hover:bg-gray-100 py-2 px-4"
      onClick={() => handleClick(room)}
    >
      <RCRoomProfile room={room} />
      <div className="truncate text-ellipsis">
        {lastMessage !== null ? (
          lastMessage.action === MessageAction.SendMessage ? (
            <CardDescription>
              <span className="font-semibold">
                {lastMessage.sender.username}:{" "}
              </span>
              {lastMessage.type === MessageType.Text ? (
                <span>{lastMessage.content}</span>
              ) : (
                <span>Send a other</span>
              )}
            </CardDescription>
          ) : lastMessage.action === MessageAction.CreateGroupChat ? (
            <CardDescription>
              <span className="font-semibold">
                {lastMessage.sender.username} created group chat
              </span>
            </CardDescription>
          ) : lastMessage.action === MessageAction.AddGroupMember ? (
            <CardDescription>
              <span className="font-semibold">
                {lastMessage.sender.username} added {lastMessage.content}
              </span>
            </CardDescription>
          ) : lastMessage.action === MessageAction.RemoveGroupMember ? (
            <CardDescription>
              <span className="font-semibold">
                {lastMessage.sender.username} removed {lastMessage.content}
              </span>
            </CardDescription>
          ) : (
            <CardDescription>
              <span className="font-semibold">
                {lastMessage.sender.username}: Action-{lastMessage.action}
              </span>
            </CardDescription>
          )
        ) : (
          "Send first message"
        )}
      </div>
    </Card>
  );
};

export default RCInboxCard;
