"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TelebirrModalProps {
  open: boolean;
  onClose: () => void;
}

export function TelebirrModal({ open, onClose }: TelebirrModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-white text-black p-0 overflow-hidden">
        <div className="flex flex-col items-center p-6">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-02%20215005-czYocfkYDVqXFBwjxw01ByQuCLWKj6.png"
              alt="Telebirr Logo"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-xl font-bold mb-2">Easy Online Payment</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Make your payment expeditious now, <br />
            faster today. No additional admin fee.
          </p>

          <Button className="w-full bg-black text-white hover:bg-gray-800 mb-3">
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full border-blue-400 text-blue-500 hover:bg-blue-50"
          >
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
