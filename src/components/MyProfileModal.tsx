import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAvatar from "./UserAvatar";
import useAuthStore from "@/stores/auth";

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const MyProfileModal = ({ isOpen, onClose }: MyProfileModalProps) => {
  const { profile } = useAuthStore();

  if (!profile) {
    return <p>Something wrong!</p>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>View your profile information</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <UserAvatar
            avatar={profile.avatar}
            name={profile.nickname}
            className="w-20 h-20 text-4xl"
          />
          <div className="flex flex-col space-y-2 items-center">
            <span className="font-semibold">{profile.nickname}</span>
            <span className="text-xs text-muted-foreground">
              @{profile.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile.mobile}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyProfileModal;
