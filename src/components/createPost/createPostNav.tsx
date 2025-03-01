"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, FileText, Image, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const steps = [
  {
    name: "Details",
    path: "/dashboard/createpost/step1",
    icon: FileText,
    description: "Basic information about your post",
  },
  {
    name: "Media",
    path: "/dashboard/createpost/step2",
    icon: Image,
    description: "Add images or videos to your post",
  },
  {
    name: "Content",
    path: "/dashboard/createpost/step3",
    icon: MessageSquare,
    description: "Write your post content",
  },
  {
    name: "Review",
    path: "/dashboard/createpost/review",
    icon: Send,
    description: "Review and publish your post",
  },
];

export default function CreatePostNav() {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="fixed md:top-1/2 md:right-6 md:-translate-y-1/2 top-4 right-4 flex md:flex-col items-end animate-float">
      <nav
        className="py-2 px-2 md:py-6 md:px-4"
        aria-label="Post creation progress"
      >
        <div className="relative flex md:flex-col items-center md:space-y-8 space-x-4 md:space-x-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.path}
                className="relative flex flex-col items-center"
              >
                {/* Connecting Line */}
                {index > 0 && (
                  <div className="absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:w-[2px] md:h-8 md:-translate-y-8 top-1/2 -translate-y-1/2 left-0 w-4 h-[2px] -translate-x-4">
                    <div
                      className={cn(
                        "h-full w-full transition-all duration-500",
                        index <= currentIndex ? "bg-green-500" : "bg-gray-200"
                      )}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={step.path}
                        className={cn(
                          "relative z-10 flex items-center justify-center w-8 h-8 md:w-14 md:h-14 rounded-full transition-all duration-500",
                          "border-2 md:border-[3px] hover:scale-110",
                          isCompleted
                            ? "border-green-500 text-green-500 bg-white"
                            : isCurrent
                            ? "border-sky-500 text-black bg-white ring-2 ring-sky-300"
                            : "border-gray-300 text-gray-400 hover:border-gray-400",
                          isCurrent && "animate-pulse-slow",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-current={isCurrent ? "step" : undefined}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 md:w-6 md:h-6 animate-in fade-in-50 duration-300" />
                        ) : (
                          <StepIcon className="w-4 h-4 md:w-6 md:h-6" />
                        )}
                        <span className="sr-only">{step.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="flex flex-col gap-1 md:hidden"
                    >
                      <p className="font-medium">{step.name}</p>
                    </TooltipContent>
                    <TooltipContent
                      side="left"
                      className="flex-col gap-1 hidden md:flex"
                    >
                      <p className="font-medium">{step.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                      <p className="text-xs font-medium">
                        {isCompleted ? (
                          <span className="text-green-500">Completed</span>
                        ) : isCurrent ? (
                          <span className="text-sky-500">Current step</span>
                        ) : (
                          <span className="text-gray-400">Not started</span>
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
