import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({
  avatar,
  name,
  className,
  onClick,
}: {
  avatar?: string;
  name: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Avatar className={className} onClick={onClick}>
      <AvatarImage src={avatar} alt="avatar" />
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
