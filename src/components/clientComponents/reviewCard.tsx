"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { SingleStar } from "../singleStar";

interface Review {
  id: string;
  userId: string;
  productId: string;
  name: string;
  rating: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.numberOfLikes);
  const [dislikes, setDislikes] = useState(review.numberOfDislikes);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="bg-[#2a2a2a] border-[#3a3a3a] text-white h-[200px] sm:h-[250px] md:h-[300px] flex flex-col w-full max-w-full sm:max-w-[350px] md:max-w-[384px]">
      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-400">
            Review By{" "}
            <span className="font-medium text-white">
              {review.name.split(" ")[0]}
            </span>
          </div>
          <SingleStar rating={review.rating} />
        </div>
      </CardHeader>

      {/* Scrollable Content Area with Fixed Height */}
      <CardContent className="px-3 sm:px-4 py-2 flex-grow max-h-[160px] sm:max-h-[200px] md:max-h-[240px] overflow-hidden overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-[#3a3a3a]">
            <AvatarFallback className="bg-[#3a3a3a] text-white text-xs sm:text-sm">
              {getInitials(review.name)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium text-sm sm:text-base">{review.name}</div>
        </div>
        <p className="text-xs sm:text-sm text-gray-300">{review.comment}</p>
      </CardContent>

      <CardFooter className="border-t border-[#3a3a3a] pt-2 sm:pt-3 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            onClick={() => setLikes((prev) => prev + 1)}
          >
            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{likes}</span>
          </button>
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            onClick={() => setDislikes((prev) => prev + 1)}
          >
            <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{dislikes}</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
