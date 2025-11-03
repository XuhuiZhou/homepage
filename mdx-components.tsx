import type { MDXComponents } from 'mdx/types'
import { ComponentPropsWithoutRef } from 'react'
import { highlight } from 'sugar-high'

let citationCounter = 0
const citations: Record<string, number> = {}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function Cite({ children, id }: { children: React.ReactNode; id: string }) {
  if (!citations[id]) {
    citationCounter++
    citations[id] = citationCounter
  }
  const num = citations[id]

  return (
    <>
      <sup className="text-zinc-600 dark:text-zinc-400">
        {num}
      </sup>
      <span className="sidenote hidden xl:inline-block float-right clear-right w-[280px] mr-[-312px] mt-0 mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-charter">
        <sup className="mr-1">{num}</sup>
        {children}
      </span>
    </>
  )
}

function Citation({ children, num, id }: { children: React.ReactNode; num: number; id: string }) {
  return (
    <div id={`citation-${num}`} className="flex gap-2 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">[{num}]</span>
      <div className="flex-1">
        {children}
        {' '}
        <a
          href={`#ref-${num}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ↩
        </a>
      </div>
    </div>
  )
}

function createHeading(level: number) {
  return ({ children }: { children?: React.ReactNode }) => {
    const text = typeof children === 'string' ? children : String(children)
    const slug = slugify(text)
    const Tag = `h${level}` as keyof JSX.IntrinsicElements

    return (
      <Tag id={slug}>
        {children}
      </Tag>
    )
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    Cite,
    Citation,
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure>
          <img src={src} alt={alt} className="rounded-xl" />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      )
    },
    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      const codeHTML = highlight(children as string)
      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },
  }
}
