"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X, Home, Info, Github, FileText, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Nav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { href: "/", label: "Work", icon: Home },
  ]

  const externalLinks = [
    { href: "https://github.com/st-miki", label: "Github", icon: Github },
    { href: "/resume.pdf", label: "Resume", icon: FileText },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-6 py-6 mx-auto max-w-7xl backdrop-blur-md">
        <Link href="/" className="flex flex-col">
          <span className="text-xl tracking-tight text-white">Michael Engida</span>
          <span className="text-sm text-zinc-400">Software Engineer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 p-1 bg-zinc-800/50 backdrop-blur-md rounded-full">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm rounded-full transition-colors"
            >
              <span
                className={`relative z-10 ${pathname === item.href ? "text-black" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </span>
              {pathname === item.href && (
                <motion.span
                  className="absolute inset-0 bg-white rounded-full"
                  layoutId="activeNavBackground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {externalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center justify-center h-full"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 text-lg ${
                      pathname === item.href ? "text-white" : "text-white/70"
                    }`}
                    onClick={toggleMenu}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {externalLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-3 text-lg text-white/70"
                    onClick={toggleMenu}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.button
              className="absolute top-6 right-6 text-white"
              onClick={toggleMenu}
              aria-label="Close menu"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

