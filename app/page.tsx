'use client'
import { motion } from 'motion/react'
import { Magnetic } from '@/components/ui/magnetic'
import Link from 'next/link'
import Image from 'next/image'
import {
  EMAIL,
  SOCIAL_LINKS,
} from './data'
import { NEWS_ITEMS } from './data/news'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function Personal() {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {/* Profile Picture - Hidden on Mobile, Float Right on Desktop */}
        <motion.div
          className="hidden md:float-right md:ml-8 md:flex md:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-46 h-60"> 
            <Image
              src="/profile.jpg"
              alt="Xuhui Zhou"
              fill
              className="rounded-2xl object-cover object-top ring-2 ring-zinc-200 dark:ring-zinc-800"
              priority
            />
          </div>
        </motion.div>

        {/* Bio Content with Text Wrapping */}
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            I am a PhD student at the{' '}
            <a
              href="https://www.lti.cs.cmu.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
            >
              Language Technologies Institute at CMU
            </a>
            , advised by{' '}
            <a
              href="http://maartensap.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
            >
              Maarten Sap
            </a>
            .
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            I am interested in socially intelligent AI. More specifically:
          </p>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <span>📢</span>
              <span>
                How do we build socially intelligent AI systems? e.g.,{' '}
                <a
                  href="https://sotopia.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  Sotopia
                </a>
                ,{' '}
                <a
                  href="https://arxiv.org/abs/2509.00559"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  Social World Models
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span>🧱</span>
              <span>
                How do we create AI agents that effectively help humans? e.g.,{' '}
                <a
                  href="https://webarena.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  WebArena
                </a>
                ,{' '}
                <a
                  href="https://arxiv.org/abs/2510.21903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  TOM-SWE
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span>🛡️</span>
              <span>
                How do we ensure AI systems behave safely and align with human values? e.g.,{' '}
                <a
                  href="https://haicosystem.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  HAICOSYSTEM
                </a>
                ,{' '}
                <a
                  href="https://arxiv.org/abs/2507.06134"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-50 dark:decoration-zinc-700"
                >
                  OpenAgentSafety
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* Clear float for next section */}
        <div className="clear-both"></div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">News</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {NEWS_ITEMS.slice(0, 5).map((item, index) => (
                <tr key={index} className="group">
                  <td className="py-3 pr-4 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap align-top">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td
                    className="py-3 text-sm text-zinc-600 dark:text-zinc-400"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {NEWS_ITEMS.length > 5 && (
          <div className="mt-4">
            <Link
              href="/news"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              View all news →
            </Link>
          </div>
        )}
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
