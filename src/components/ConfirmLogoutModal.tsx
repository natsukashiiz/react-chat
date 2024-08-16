import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmLogoutModalProps {
  handleLogout: () => void;
}
type PropsWithChildren<T> = T & { children?: React.ReactNode };
const ConfirmLogoutModal = ({
  handleLogout,
  children,
}: PropsWithChildren<ConfirmLogoutModalProps>) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to logout?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleLogout}>Confirm</Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
