'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { useEffect, useState } from 'react'
import { Footer } from '../footer'

function CopyButton() {
  const [text, setText] = useState('Copy')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    setTimeout(() => {
      setText('Copy')
    }, 2000)
  }, [text])

  return (
    <button
      onClick={() => {
        setText('Copied')
        navigator.clipboard.writeText(currentUrl)
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPostPage = pathname !== '/blog'

  return (
    <div className="flex min-h-screen flex-col blog-tufte-light dark:blog-tufte-dark">
      {/* Compact header - for all blog pages */}
      <header className="w-full border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex w-full items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Xuhui Zhou
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === '/'
                  ? 'font-medium text-zinc-700 dark:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              About
            </Link>
            <Link
              href="/publications"
              className={`transition-colors ${
                pathname === '/publications'
                  ? 'font-medium text-zinc-700 dark:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              Publications
            </Link>
            <Link
              href="/cv"
              className={`transition-colors ${
                pathname === '/cv'
                  ? 'font-medium text-zinc-700 dark:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              CV
            </Link>
            <Link
              href="/blog"
              className={`transition-colors ${
                pathname?.startsWith('/blog')
                  ? 'font-medium text-zinc-700 dark:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/more"
              className={`transition-colors ${
                pathname === '/more'
                  ? 'font-medium text-zinc-700 dark:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              More
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog content */}
      <div className="relative mx-auto w-full max-w-[1400px] flex-1 px-6 pt-12 blog-post">
        {isPostPage ? (
          <>
            <ScrollProgress
              className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
              springOptions={{
                bounce: 0,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[224px_1fr] xl:grid-cols-[224px_1fr_300px] gap-12">
              {/* Table of Contents Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <nav className="space-y-1 text-sm">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                      On this page
                    </div>
                    <a href="#introduction" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Introduction
                    </a>
                    <a href="#what-does-user-effective-mean" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      What does "user-effective" mean?
                    </a>
                    <a href="#the-theory-of-mind-gap" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      The theory of mind gap
                    </a>
                    <a href="#design-principles-for-user-effective-agents" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Design principles
                    </a>
                    <a href="#measuring-user-effectiveness" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Measuring user effectiveness
                    </a>
                    <a href="#case-studies" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Case studies
                    </a>
                    <a href="#looking-forward" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Looking forward
                    </a>
                    <a href="#conclusion" className="block py-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      Conclusion
                    </a>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="min-w-0">
                <div className="absolute right-4 top-4">
                  <CopyButton />
                </div>
                <main className="prose prose-gray pb-20 font-charter text-[18px] leading-[27px] prose-h4:prose-base dark:prose-invert prose-h1:text-[48px] prose-h1:font-bold prose-h1:leading-[1] prose-h1:mb-4 prose-h2:mt-12 prose-h2:mb-3 prose-h2:scroll-m-20 prose-h2:text-[33px] prose-h2:leading-[1] prose-h2:font-normal prose-h2:italic prose-h3:text-[25.5px] prose-h3:leading-[1] prose-h3:font-normal prose-h3:italic prose-h3:mt-6 prose-h3:mb-2 prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-semibold prose-a:text-inherit prose-a:no-underline prose-a:border-b prose-a:border-current">
                  {children}
                </main>
              </div>

              {/* Right margin for citations - hidden on lg, visible on xl */}
              <div className="hidden xl:block" aria-hidden="true"></div>
            </div>
          </>
        ) : (
          <div className="mx-auto w-full max-w-prose">{children}</div>
        )}
      </div>
    </div>
  )
}
