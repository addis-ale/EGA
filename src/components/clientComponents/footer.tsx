import { Instagram, Send } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3b4032] text-white py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between">
        {/* Logo and social icons */}
        <div className="mb-8 md:mb-0">
          <Link href="/" className="inline-block">
            <h2 className="text-4xl font-bold tracking-tight">EGA</h2>
            <p className="text-sm text-gray-300">Game Store</p>
          </Link>
          <div className="flex items-center mt-6 space-x-4">
            <Link href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Instagram</span>
              <Instagram size={20} />
            </Link>
          </div>
        </div>

        {/* Navigation links */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-lg font-medium mb-4">Store</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Feedbacks
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Help center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Legal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-8 md:mt-0">
          <h3 className="text-lg font-medium mb-4">Stay up to date</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#4b5042] text-white px-4 py-2 rounded-l-md w-full max-w-xs focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#4b5042] p-2 rounded-r-md hover:bg-[#5a604f] transition-colors"
              aria-label="Subscribe"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
