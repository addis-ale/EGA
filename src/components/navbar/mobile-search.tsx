import Link from "next/link";
import { Input } from "@/components/ui/input";
interface MobileSearchProps {
  isOpen: boolean;
}
export function MobileSearch({ isOpen }: MobileSearchProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden px-4 pb-4 flex flex-col justify-start">
      <Input
        placeholder="Search games..."
        className="w-full max-w-3xl bg-white text-black border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="font-bold">
        <Link href="/filter" className="text-lg font-semibold text-white">
          Filter
        </Link>
      </div>
    </div>
  );
}
