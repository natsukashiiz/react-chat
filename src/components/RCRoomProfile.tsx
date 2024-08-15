import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Room } from "@/types/api";

const RCRoomProfile = ({ room }: { room: Room }) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage src={room.image!} alt="avatar" />
        <AvatarFallback>{room.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span>{room.name}</span>
    </div>
  );
};

export default RCRoomProfile;
