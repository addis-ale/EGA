"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SignUpDialog } from "./signup-dialog";
import Image from "next/image";

// Zod Schema for Form Validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LogInDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle Form Submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Change to `true` to auto-redirect
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        router.refresh();
        onClose();
      }
    } catch {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSwitchToSignUp = () => {
    setIsOpen(false);
    setShowSignUp(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent hover:text-gray-300 p-3 rounded-full bg-shadGray"
          >
            <User className="h-5 w-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] bg-white rounded-xl shadow-lg mx-auto p-4 sm:p-6">
          <DialogHeader className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center w-full">
              <Button variant="link" onClick={handleSwitchToSignUp}>
                <div className="border border-gray-300 rounded-xl p-2">
                  <Image
                    src="/log-in-04.svg"
                    width={29}
                    height={29}
                    alt="login"
                  />
                </div>
              </Button>
            </div>

            <DialogTitle className="text-black mt-4">
              Log in to your account
            </DialogTitle>
            <DialogDescription>
              Welcome back! Please enter your details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                placeholder="example@example.com"
                {...register("email")}
                className="py-6 text-black"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="py-6 text-black"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white hover:text-black "
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-black font-bold" />
                  ) : (
                    <Eye className="h-4 w-4 text-black font-bold" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-0">
              <label className="flex gap-2 items-center">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-shadGray text-sm">
                  Save my login details
                </span>
              </label>
              <button className="text-teal font-bold hover:underline text-sm">
                Forgot password?
              </button>
            </div>
            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal text-white py-6 hover:bg-teal/90"
              >
                <span className="text-lg font-semibold">
                  {isSubmitting ? "Logging in..." : "Get started"}
                </span>
              </Button>
              <div className="relative text-center">
                <span className="bg-white px-2 relative z-10 text-shadGray text-sm">
                  OR
                </span>
                <div className="absolute left-0 top-1/2 w-full border-b border-gray-300"></div>
              </div>
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-white text-black py-6 border border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <Image
                      src="/google.svg"
                      width={29}
                      height={29}
                      alt="login"
                    />
                  </div>
                  <span className="text-lg font-semibold">
                    {isSubmitting ? "Logging in..." : "Sign up with Google"}
                  </span>
                </div>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SignUp Dialog */}
      <SignUpDialog
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToLogin={() => {
          setShowSignUp(false);
          setIsOpen(true);
        }}
      />
    </>
  );
}
