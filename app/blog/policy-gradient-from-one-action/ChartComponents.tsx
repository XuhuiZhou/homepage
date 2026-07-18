'use client'

import dynamic from 'next/dynamic'

export const OneStepTrajectory = dynamic(() => import('./OneStepTrajectory'), {
  ssr: false,
})

export const ReturnDecomposition = dynamic(
  () => import('./ReturnDecomposition'),
  { ssr: false },
)

export const ExpectationWorlds = dynamic(() => import('./ExpectationWorlds'), {
  ssr: false,
})

export const QExpectationDemo = dynamic(() => import('./QExpectationDemo'), {
  ssr: false,
})

export const AdvantageBaselineDemo = dynamic(
  () => import('./AdvantageBaselineDemo'),
  { ssr: false },
)

export const BaselineCancellationDemo = dynamic(
  () => import('./BaselineCancellationDemo'),
  { ssr: false },
)

export const GradientLadder = dynamic(() => import('./GradientLadder'), {
  ssr: false,
})
