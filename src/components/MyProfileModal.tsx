import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAvatar from "./UserAvatar";
import useAuthStore from "@/stores/auth";
import { uploadFile } from "@/api/file";
import { updateProfile } from "@/api/profile";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { PenLineIcon, XIcon, SaveIcon } from "lucide-react";
import { UpdateProfileBody } from "@/types/api";

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const MyProfileModal = ({ isOpen, onClose }: MyProfileModalProps) => {
  const { profile, updateMyProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [nickname, setNickname] = useState(profile?.nickname);

  if (!profile) {
    return <p>Something wrong!</p>;
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await uploadFile(formData);
        if (res.status === 200 && res.data) {
          await handleUpdateProfile({ avatar: res.data.data.url });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveProfile = () => {
    handleUpdateProfile({ nickname });
    setEditMode(false);
  };

  const handleUpdateProfile = async (data: UpdateProfileBody) => {
    try {
      const res = await updateProfile(data);
      if (res.status === 200 && res.data) {
        updateMyProfile(res.data.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>View your profile information</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadFile}
            className="hidden"
          />
          <UserAvatar
            avatar={profile.avatar}
            name={profile.nickname}
            className="w-20 h-20 text-4xl hover:outline hover:outline-2 hover:outline-rose-500 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          <div className="flex flex-col space-y-2 items-center">
            <div className="flex space-x-1 items-center">
              {editMode ? (
                <>
                  <Input
                    className="font-semibold"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <XIcon
                    className="w-4 h-4 cursor-pointer hover:scale-150"
                    onClick={() => {
                      setEditMode(false);
                      setNickname(profile.nickname);
                    }}
                  />
                  <SaveIcon
                    className="w-4 h-4 cursor-pointer hover:scale-150"
                    onClick={handleSaveProfile}
                  />
                </>
              ) : (
                <>
                  <span>{profile.nickname}</span>
                  <PenLineIcon
                    className="w-4 h-4 cursor-pointer hover:scale-150"
                    onClick={() => setEditMode(true)}
                  />
                </>
              )}
            </div>
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
