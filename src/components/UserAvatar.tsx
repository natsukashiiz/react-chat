import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({
  avatar,
  name,
  className,
}: {
  avatar?: string;
  name: string;
  className?: string;
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={avatar} alt="avatar" />
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
