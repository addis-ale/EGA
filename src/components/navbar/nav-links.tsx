import Link from "next/link";

export function NavLinks() {
  return (
    <nav className="hidden lg:flex items-center gap-6">
      <Link href="/" className="text-sm text-white hover:text-gray-300">
        Home
      </Link>
      <Link
        href="/filter"
        className="text-sm text-white hover:text-gray-300 font-semibold"
      >
        Filter
      </Link>
    </nav>
  );
}
