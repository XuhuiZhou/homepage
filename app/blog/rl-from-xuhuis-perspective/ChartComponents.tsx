'use client'

import dynamic from 'next/dynamic'

export const AdvantageEstimationChart = dynamic(
  () => import('./AdvantageEstimationChart'),
  { ssr: false }
)

export const MonteCarloChart = dynamic(
  () => import('./MonteCarloChart'),
  { ssr: false }
)

export const AlgorithmTreeChart = dynamic(
  () => import('./AlgorithmTreeChart'),
  { ssr: false }
)

export const KLDirectionChart = dynamic(
  () => import('./KLDirectionChart'),
  { ssr: false }
)

export const PolicySharpeningChart = dynamic(
  () => import('./PolicySharpeningChart'),
  { ssr: false }
)
