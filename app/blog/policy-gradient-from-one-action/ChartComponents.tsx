'use client'

import dynamic from 'next/dynamic'

export const OneStepTrajectory = dynamic(() => import('./OneStepTrajectory'), {
  ssr: false,
})

export const ScoreFunctionPlayground = dynamic(
  () => import('./ScoreFunctionPlayground'),
  { ssr: false },
)

export const TokenCreditAssignment = dynamic(
  () => import('./TokenCreditAssignment'),
  { ssr: false },
)

export const BaselineVarianceDemo = dynamic(
  () => import('./BaselineVarianceDemo'),
  { ssr: false },
)

export const AlgorithmMap = dynamic(() => import('./AlgorithmMap'), {
  ssr: false,
})
