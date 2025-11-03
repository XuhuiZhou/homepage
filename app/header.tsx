'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            Xuhui Zhou
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Making Socially Intelligent AI
          </TextEffect>
        </div>
      </div>
      <nav className="mt-6 flex gap-6 text-sm">
        <Link
          href="/"
          className={`transition-colors ${
            pathname === '/'
              ? 'font-medium text-zinc-900 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
          }`}
        >
          About
        </Link>
        <Link
          href="/publications"
          className={`transition-colors ${
            pathname === '/publications'
              ? 'font-medium text-zinc-900 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
          }`}
        >
          Publications
        </Link>
        <Link
          href="/blog"
          className={`transition-colors ${
            pathname?.startsWith('/blog')
              ? 'font-medium text-zinc-900 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
          }`}
        >
          Blog
        </Link>
      </nav>
    </header>
  )
}
