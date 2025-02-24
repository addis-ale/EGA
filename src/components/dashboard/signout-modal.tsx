"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logout } from "@/state/features/currentUserSlice";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";

interface SignoutModalProps {
  onClose: () => void;
}

export function SignoutModal({ onClose }: SignoutModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSignout = async () => {
    await signOut({ redirect: false });
    dispatch(logout());

    onClose();
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg z-50 flex flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle className="text-xl text-black">
              Are you sure you want to sign out?
            </DialogTitle>
            <DialogDescription className="text-black">
              Once you sign out, you will need to log in again to access your
              account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start space-x-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleSignout}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
