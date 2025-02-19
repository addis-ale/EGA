"use client";

import Button from "@/components/button";
import Heading from "@/components/heading";
import Input from "@/components/inputs/input";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";

// ✅ Define Zod validation schema for LOGIN
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log("Form Data:", data);
    setIsLoading(true);
    // Add login API call logic here
  };

  return (
    <div className="w-[480px] bg-white rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex justify-end gap-36">
          <div className="border rounded-xl w-fit p-2">
            <Image src={"/log-in-04.svg"} width={29} height={29} alt="login" />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 transition duration-300">
            <X size={25} className="text-shadGray" />
          </button>
        </div>
        <div className="flex justify-center flex-col items-center gap-2 pb-2">
          <Heading title="Log in to your account" />
          <p className="text-shadGray text-center">
            Welcome back! Please enter your details.
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="px-6 flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <span className="text-black">Email*</span>
          <Input
            id="email"
            label="Enter your email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2 relative">
          <span className="text-black">Password*</span>
          <div className="relative w-full">
            <Input
              id="password"
              label="Enter your password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-5 text-gray-500 hover:text-black"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Save login details & Forgot password */}
      <div className="px-6 flex justify-between items-center mt-4">
        <label className="flex gap-2 items-center">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-shadGray">Save my login details</span>
        </label>
        <button className="text-teal font-bold hover:underline">
          Forgot password?
        </button>
      </div>

      {/* Buttons */}
      <div className="px-6 pt-6 pb-8 flex flex-col gap-4">
        <Button
          label={isLoading ? "Loading..." : "Get started"}
          onClick={handleSubmit(onSubmit)}
        />

        {/* Divider */}
        <div className="relative text-center">
          <span className="bg-white px-2 relative z-10 text-shadGray">OR</span>
          <div className="absolute left-0 top-1/2 w-full border-b border-gray-300"></div>
        </div>

        {/* Google Login */}
        <Button
          icon={FcGoogle}
          label="Continue with Google"
          onClick={() => console.log("Google login")}
          outline
        />
      </div>
    </div>
  );
};

export default LoginForm;
