'use client'
import { motion } from 'motion/react'
import { NEWS_ITEMS } from '../data/news'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export default function News() {
  return (
    <motion.div
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={VARIANTS_ITEM}>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">News</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Updates on publications, talks, and research activities.
        </p>
      </motion.div>

      <motion.div variants={VARIANTS_ITEM}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {NEWS_ITEMS.map((item, index) => (
                <tr key={index} className="group">
                  <td className="py-4 pr-6 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap align-top">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td
                    className="py-4 text-sm text-zinc-600 dark:text-zinc-400"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
