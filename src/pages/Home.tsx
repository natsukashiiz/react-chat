import RCChat from "@/components/RCChat";
import RCInboxes from "@/components/RCInboxes";
import useRoomStore from "@/stores/room";
import { Room } from "@/types/api";
import { useEffect, useState } from "react";
import { getMessages } from "@/api/message";

const Home = () => {
  const { currentRoom } = useRoomStore();
  const [room, setRoom] = useState<Room | null>();

  useEffect(() => {
    if (currentRoom) {
      const loadMessages = async () => {
        if (!currentRoom) return;
        try {
          const res = await getMessages(currentRoom.id);
          if (res.status === 200 && res.data) {
            setRoom(res.data.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadMessages();
    }
  }, [currentRoom]);

  return (
    <div className="grid grid-cols-3 gap-10 h-[90vh]">
      <div className="overflow-y-scroll px-2">
        <RCInboxes />
      </div>
      <div className="col-span-2 overflow-y-scroll px-2">
        <RCChat room={room} />
      </div>
    </div>
  );
};

export default Home;
