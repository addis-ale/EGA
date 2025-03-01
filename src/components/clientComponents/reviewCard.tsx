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
    <Card className="bg-[#2a2a2a] border-[#3a3a3a] text-white h-full flex flex-col w-full md:w-96">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Review By{" "}
            <span className="font-medium text-white">
              {review.name.split(" ")[0]}
            </span>
          </div>
          <SingleStar rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border border-[#3a3a3a]">
            <AvatarFallback className="bg-[#3a3a3a] text-white">
              {getInitials(review.name)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{review.name}</div>
        </div>
        <p className="text-sm text-gray-300">{review.comment}</p>
      </CardContent>
      <CardFooter className="border-t border-[#3a3a3a] pt-3">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-white"
            onClick={() => setLikes((prev) => prev + 1)}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{likes}</span>
          </button>
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-white"
            onClick={() => setDislikes((prev) => prev + 1)}
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-sm">{dislikes}</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
