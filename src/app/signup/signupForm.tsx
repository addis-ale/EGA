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
import { useRouter } from "next/navigation";
import axios from "axios";

// ✅ Define Zod validation schema for SIGNUP
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null); // State for signup error message

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

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    console.log("Form Data:", data);
    setIsLoading(true);
    setSignupError(null); // Reset the error state

    try {
      const response = await axios.post("../api/signup", data);
      if (response.status === 200) {
        console.log("Signup successful!", response.data);
        // Optionally redirect or show a success message
        router.push("/"); // Replace with your success page
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSignupError(error.response.data.message || "Signup failed"); // Show the error message
        console.error("Error during signup:", error.response.data);
      } else {
        console.error("Error during signup:", error);
        setSignupError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(); // Clears all input fields
    setSignupError(null); // Reset error state on cancel
  };

  return (
    <div className="w-[480px] bg-white rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 border-b">
        <div className="flex justify-between">
          <div className="border rounded-xl w-fit p-2">
            <Image src={"/flag-05.svg"} width={29} height={29} alt="flag" />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 transition duration-300">
            <X size={25} className="text-shadGray" />
          </button>
        </div>
        <Heading title="Sign up" />
      </div>

      {/* Input Fields */}
      <div className="px-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-black">Name*</span>
          <Input
            id="name"
            label="Enter your name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
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
        <div className="flex flex-col gap-2 relative">
          <span className="text-black">Password*</span>
          <div className="relative w-full">
            <Input
              id="password"
              label="Create a password"
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
          <p className="text-shadGray mb-4">Must be at least 8 characters.</p>
        </div>
      </div>

      {/* Error Message */}
      {signupError && (
        <p className="text-red-500 text-sm text-center">{signupError}</p>
      )}

      {/* Buttons */}
      <div className="px-6 py-4 flex flex-col gap-4">
        <Button
          label={isLoading ? "Loading" : "Confirm"}
          onClick={handleSubmit(onSubmit)} // Call handleSubmit directly here
        />
        <Button label="Cancel" onClick={handleCancel} outline />
      </div>
    </div>
  );
};

export default SignUpForm;
