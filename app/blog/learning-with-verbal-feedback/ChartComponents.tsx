'use client'

import dynamic from 'next/dynamic'

// Animated figures (new)
export const ArcTimeline = dynamic(() => import('./ArcTimeline'), { ssr: false })
export const ScalarCollapseFunnel = dynamic(
  () => import('./ScalarCollapseFunnel'),
  { ssr: false }
)
export const HonestyMeter = dynamic(() => import('./HonestyMeter'), { ssr: false })
export const ReflexionVsDitto = dynamic(() => import('./ReflexionVsDitto'), {
  ssr: false,
})
export const RootsBraid = dynamic(() => import('./RootsBraid'), { ssr: false })
export const DittoMechanism = dynamic(() => import('./DittoMechanism'), {
  ssr: false,
})

// Data figures (retained)
export const SoulResultsChart = dynamic(() => import('./SoulResultsChart'), {
  ssr: false,
})
export const SoulRadarChart = dynamic(() => import('./SoulRadarChart'), {
  ssr: false,
})
export const TeacherStudentGapChart = dynamic(
  () => import('./TeacherStudentGapChart'),
  { ssr: false }
)
export const FeedbackEvolutionCard = dynamic(
  () => import('./FeedbackEvolutionCard'),
  { ssr: false }
)
