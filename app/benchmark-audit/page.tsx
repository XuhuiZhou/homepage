import type { Metadata } from 'next'
import FrontierModelsPage from '../benchmarks/frontier-models/page'

const SITE_URL = 'https://xuhuiz.com'
const CANONICAL_URL = `${SITE_URL}/benchmarks/frontier-models`
const SHARE_URL = `${SITE_URL}/benchmark-audit`
const CARD_IMAGE_URL = `${SITE_URL}/benchmarks/frontier-models/opengraph-image?share=benchmark-audit-20260710`
const DESCRIPTION =
  'An audit of capability scores, safety reporting, and benchmark turnover across 18 frontier model releases.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Frontier Model Benchmark Audit | Xuhui Zhou',
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: 'Frontier Model Benchmark Audit',
    description: DESCRIPTION,
    type: 'article',
    url: SHARE_URL,
    images: [
      {
        url: CARD_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Frontier Model Benchmark Audit covering capability, safety, and reporting turnover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontier Model Benchmark Audit',
    description: DESCRIPTION,
    creator: '@nlpxuhui',
    images: [
      {
        url: CARD_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Frontier Model Benchmark Audit covering capability, safety, and reporting turnover',
      },
    ],
  },
}

export default FrontierModelsPage
