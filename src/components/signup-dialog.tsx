"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

// Zod Schema for Form Validation
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpDialog({
  isOpen,
  onClose,
  onSwitchToLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        toast({
          title: "Registration Success 🎉",
          description: "Welcome to EGA! Redirecting...",
          variant: "default",
        });
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false, // Change to `true` to auto-redirect
        });
        onClose();
        router.push("/");
        router.refresh();
      } else if (response.status === 409) {
        toast({
          title: "User already exists!",
          description: "Try to log in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong!",
          description: "Try again later",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong! Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[480px] bg-white rounded-xl shadow-lg mx-auto p-0">
        <div className="flex flex-col gap-4 p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <button
              onClick={onSwitchToLogin}
              className="border rounded-xl w-fit p-2"
            >
              <Image src="/flag-05.svg" width={29} height={29} alt="flag" />
            </button>
          </div>
          <DialogTitle className="text-black font-bold text-2xl">
            Sign Up
          </DialogTitle>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-4 sm:px-6 py-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <span className="text-black text-sm">Name*</span>
            <Input
              id="name"
              placeholder="Enter your name"
              disabled={isLoading}
              {...register("name")}
              className="py-6 text-black"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-black text-sm">Email*</span>
            <Input
              id="email"
              placeholder="Enter your email"
              disabled={isLoading}
              {...register("email")}
              className="py-6 text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 relative">
            <span className="text-black text-sm">Password*</span>
            <div className="relative w-full">
              <Input
                id="password"
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                {...register("password")}
                className="py-6 text-black"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
            <p className="text-shadGray text-xs sm:text-sm mb-2 sm:mb-4">
              Must be at least 8 characters.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal text-white py-6 hover:bg-teal/90"
            >
              {isLoading ? "Loading" : "Confirm"}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-white text-black py-6 border border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
