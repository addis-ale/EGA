import { Skeleton } from "@/components/ui/skeleton";

export function DetailHeroSkeleton() {
  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8 mt-12 sm:mt-16 md:mt-24 lg:mt-[120px] min-h-screen bg-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Skeleton className="h-8 w-3/4 bg-zinc-800" />
            <Skeleton className="h-6 w-1/4 bg-zinc-800" />
          </div>

          <Skeleton className="w-full aspect-[16/9] md:aspect-[4/3] rounded-lg bg-zinc-800" />

          <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full">
            <Skeleton className="h-6 w-1/2 bg-zinc-800" />

            <Skeleton className="h-20 w-full max-w-xs bg-zinc-800" />

            <div className="w-full space-y-3 bg-zinc-800 p-4 rounded-lg">
              <Skeleton className="h-8 w-full bg-zinc-700" />
              <Skeleton className="h-6 w-3/4 bg-zinc-700" />
              <Skeleton className="h-6 w-1/2 bg-zinc-700" />
            </div>

            <div className="w-full space-y-3">
              <Skeleton className="h-12 w-full bg-zinc-800" />
              <Skeleton className="h-12 w-full bg-zinc-800" />
              <div className="flex flex-col w-full space-y-2 mt-2">
                <Skeleton className="h-8 w-full bg-zinc-800" />
                <Skeleton className="h-8 w-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 md:col-span-2 text-white flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-800">
          <div className="w-full max-w-4xl">
            <Skeleton className="h-6 w-3/4 mb-4 bg-zinc-700" />

            <div className="mb-4 sm:mb-6 w-full">
              <div className="flex gap-2 sm:gap-4 justify-between w-full mb-3 sm:mb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 flex-1 bg-zinc-700" />
                ))}
              </div>
              <Skeleton className="w-full aspect-video bg-zinc-700" />
            </div>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <Skeleton className="h-8 w-1/2 bg-zinc-700" />
              <Skeleton className="h-20 w-full bg-zinc-700" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-40 w-full bg-zinc-700" />
                <Skeleton className="h-40 w-full bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
