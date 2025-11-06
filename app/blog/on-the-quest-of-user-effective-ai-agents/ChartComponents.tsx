'use client'

import dynamic from 'next/dynamic'

export const RLCurvePlot = dynamic(() => import('./RLCurvePlot'), { ssr: false })
export const ModelComparisonChart = dynamic(() => import('./ModelComparisonChart'), { ssr: false })
export const StatefulSWEChart = dynamic(() => import('./StatefulSWEChart'), { ssr: false })
export const CostEfficiencyChart = dynamic(() => import('./CostEfficiencyChart'), { ssr: false })
export const VaguePromptChart = dynamic(() => import('./VaguePromptChart'), { ssr: false })
export const InteractionDynamicsChart = dynamic(() => import('./InteractionDynamicsChart'), { ssr: false })
