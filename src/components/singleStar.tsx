import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
}

export function SingleStar({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xl font-semibold">
        {rating && rating.toFixed(1)}
      </span>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    </div>
  );
}
