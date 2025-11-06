'use client'

import { MathJaxContext } from 'better-react-mathjax'

/**
 * MathProvider component that wraps content with MathJax context for rendering math equations.
 *
 * This component provides client-side math rendering to avoid serialization issues
 * with Next.js App Router's React Server Components.
 */
export function MathProvider({ children }: { children: React.ReactNode }) {
  const config = {
    loader: { load: ['input/tex', 'output/chtml'] },
    tex: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']],
      processEscapes: true,
      processEnvironments: true,
    },
    options: {
      enableMenu: false,
    },
  }

  return <MathJaxContext config={config}>{children}</MathJaxContext>
}
