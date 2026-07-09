import Link from 'next/link'

export default function BenchmarksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold">
            Xuhui Zhou
          </Link>
          <nav className="flex items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              About
            </Link>
            <Link
              href="/publications"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Publications
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
