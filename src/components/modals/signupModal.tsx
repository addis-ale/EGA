"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/state/features/currentUserSlice";
import { useDispatch } from "react-redux";

// Zod Schema for Form Validation
const signUpSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  UserEmail: z.string().email("Invalid email address"),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      UserEmail: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      // Send user registration request
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 409) {
        toast({
          title: "User already exists!",
          description: "Try to log in",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 201) {
        toast({
          title: "Registration Success 🎉",
          description: "Welcome to EGA! Logging you in...",
          variant: "default",
        });

        // Log in the user automatically
        const signInResult = await signIn("credentials", {
          email: data.UserEmail,
          password: data.password,
          redirect: false, // Prevent full-page reload
        });

        if (signInResult?.error) {
          toast({
            title: "Login Failed",
            description: "Please try logging in manually.",
            variant: "destructive",
          });
          return;
        }

        // Fetch user details after successful login
        const userResponse = await fetch(`/api/user?email=${data.UserEmail}`);
        const user = await userResponse.json();

        if (userResponse.ok) {
          dispatch(setUser(user)); // Update Redux state
        }

        onClose(); // Close the modal
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
      <DialogContent className="w-[90%] max-w-[480px] h-auto bg-white rounded-xl shadow-lg mx-auto p-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-2 p-3 sm:p-4 border-b">
            <div className="flex justify-between items-center">
              <button
                onClick={onSwitchToLogin}
                className="border rounded-xl w-fit p-1 sm:p-2"
              >
                <Image src="/flag-05.svg" width={24} height={24} alt="flag" />
              </button>
            </div>
            <DialogHeader>
              <DialogTitle className="text-black font-bold text-xl sm:text-2xl">
                Sign Up
              </DialogTitle>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-3 sm:px-4 py-3 flex flex-col gap-3 flex-grow"
          >
            <div className="flex flex-col gap-1">
              <span className="text-black text-xs sm:text-sm">Name*</span>
              <Input
                id="name"
                placeholder="Enter your name"
                disabled={isLoading}
                {...register("userName")}
                className="py-1 sm:py-2 lg:py-6  text-black text-sm"
              />
              {errors.userName && (
                <p className="text-red-500 text-xs">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-black text-xs sm:text-sm">Email*</span>
              <Input
                id="email"
                placeholder="Enter your email"
                disabled={isLoading}
                {...register("UserEmail")}
                className="py-1 sm:py-2 lg:py-6  text-black text-sm"
              />
              {errors.UserEmail && (
                <p className="text-red-500 text-xs">
                  {errors.UserEmail.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1 relative">
              <span className="text-black text-xs sm:text-sm">Password*</span>
              <div className="relative w-full">
                <Input
                  id="password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  {...register("password")}
                  className="py-1 sm:py-2 lg:py-6  text-black text-sm"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
              <p className="text-shadGray text-xs">
                Must be at least 8 characters.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 mt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal text-white py-1 sm:py-2 lg:py-6  text-sm"
              >
                {isLoading ? "Loading" : "Confirm"}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-white text-black py-1 sm:py-2 lg:py-6  border border-gray-300 text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
