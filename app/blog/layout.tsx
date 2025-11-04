'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import shared TOC component
const TableOfContents = dynamic(() => import('./TableOfContents'), { ssr: false })

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
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors"
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
    <div className="flex min-h-screen flex-col blog-tufte-light">
      {/* Compact header - for all blog pages */}
      <header className="w-full border-b border-zinc-100">
        <div className="flex w-full items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900"
          >
            Xuhui Zhou
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === '/'
                  ? 'font-medium text-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/publications"
              className={`transition-colors ${
                pathname === '/publications'
                  ? 'font-medium text-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Publications
            </Link>
            <Link
              href="/cv"
              className={`transition-colors ${
                pathname === '/cv'
                  ? 'font-medium text-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              CV
            </Link>
            <Link
              href="/blog"
              className={`transition-colors ${
                pathname?.startsWith('/blog')
                  ? 'font-medium text-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/more"
              className={`transition-colors ${
                pathname === '/more'
                  ? 'font-medium text-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-700'
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
              className="fixed top-0 z-20 h-0.5 bg-gray-300"
              springOptions={{
                bounce: 0,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[224px_1fr] xl:grid-cols-[224px_1fr_300px] gap-12">
              {/* Table of Contents Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents />
                </div>
              </aside>

              {/* Main Content */}
              <div className="min-w-0">
                <div className="absolute right-4 top-4">
                  <CopyButton />
                </div>
                <main className="prose prose-gray pb-20 font-charter text-[18px] leading-[27px] prose-h4:prose-base prose-h1:text-[48px] prose-h1:font-bold prose-h1:leading-[1] prose-h1:mb-4 prose-h2:mt-12 prose-h2:mb-3 prose-h2:scroll-m-20 prose-h2:text-[33px] prose-h2:leading-[1] prose-h2:font-normal prose-h2:italic prose-h3:text-[25.5px] prose-h3:leading-[1] prose-h3:font-normal prose-h3:italic prose-h3:mt-6 prose-h3:mb-2 prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-semibold prose-a:text-inherit prose-a:no-underline prose-a:border-b prose-a:border-current">
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
