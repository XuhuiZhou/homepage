'use client'

import dynamic from 'next/dynamic'

export const MemoryScalingDemo = dynamic(() => import('./MemoryScalingDemo'), {
  ssr: false,
})

export const ReassociationDemo = dynamic(() => import('./ReassociationDemo'), {
  ssr: false,
})

export const AssociativeMemoryLab = dynamic(
  () => import('./AssociativeMemoryLab'),
  { ssr: false },
)

export const ComputeScheduleDemo = dynamic(
  () => import('./ComputeScheduleDemo'),
  { ssr: false },
)

export const ResearchMap = dynamic(() => import('./ResearchMap'), {
  ssr: false,
})
