import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full max-w-xs bg-zinc-900 border-none">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
