import type { MDXComponents } from 'mdx/types'
import { ComponentPropsWithoutRef } from 'react'
import { highlight } from 'sugar-high'
import Image from 'next/image'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function Cite({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <>
      <label htmlFor={`sn-${id}`} className="sidenote-number text-[#111] dark:text-[#ddd]"></label>
      <input type="checkbox" id={`sn-${id}`} className="hidden" />
      <span className="sidenote hidden xl:inline-block float-right clear-right relative w-[50%] mr-[-60%] mt-[0.3rem] mb-0 text-[16.5px] text-[#111] dark:text-[#ddd] leading-[1.3] align-baseline font-charter">
        {children}
      </span>
    </>
  )
}

function Epigraph({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <div className="my-8">
      <blockquote className="text-[18px] italic border-none pl-8">
        {children}
        {cite && (
          <footer className="text-right mt-2 text-[18px] not-italic">
            {cite}
          </footer>
        )}
      </blockquote>
    </div>
  )
}

function NewThought({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-variant-small-caps text-[1.2em]">
      {children}
    </span>
  )
}

function MarginNote({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <>
      <label htmlFor={`mn-${id}`} className="inline-block cursor-pointer">⊕</label>
      <input type="checkbox" id={`mn-${id}`} className="hidden" />
      <span className="marginnote hidden xl:inline-block float-right clear-right relative w-[50%] mr-[-60%] mt-[0.3rem] mb-0 text-[16.5px] text-[#111] dark:text-[#ddd] leading-[1.3] align-baseline font-charter">
        {children}
      </span>
    </>
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
    Epigraph,
    NewThought,
    MarginNote,
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
        <figure className="not-prose my-8">
          <img
            src={src}
            alt={alt}
            className="w-full rounded-xl"
            loading="eager"
          />
          <figcaption className="text-center mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {caption}
          </figcaption>
        </figure>
      )
    },
    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      const codeHTML = highlight(children as string)
      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },
  }
}
