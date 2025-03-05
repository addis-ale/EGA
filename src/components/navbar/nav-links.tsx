import { useTranslations } from "next-intl";
import Link from "next/link";

export function NavLinks() {
  const t = useTranslations("NavBar");

  return (
    <nav className="hidden lg:flex items-center gap-6">
      <Link href="/" className="text-sm text-white hover:text-gray-300">
        {t("home")}
      </Link>
      <Link
        href="/filter"
        className="text-sm text-white hover:text-gray-300 font-semibold"
      >
        {t("filter")}
      </Link>
    </nav>
  );
}
