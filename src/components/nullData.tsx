"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface NullDataProps {
  title: string;
}

const NullData = ({ title }: NullDataProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearTimeout(redirect);
      clearInterval(timer);
    };
  }, [router]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center w-full h-[50vh] text-xl md:text-2xl">
      <p className="font-medium mb-4">{title}</p>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="flex items-center gap-2"
      >
        <Loader2 className="animate-spin w-6 h-6 text-gray-300" />
        <span className="text-gray-400 text-lg">
          Redirecting in {countdown}s...
        </span>
      </motion.div>
    </div>
  );
};

export default NullData;
