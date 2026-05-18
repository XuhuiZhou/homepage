'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Target distribution: 50/50 mixture of two Gaussians at -2 and +2 (σ=0.5).
// Represents a "data" distribution with two valid modes (e.g., two valid
// continuations the SFT corpus supports).
const MIX_LEFT = { mean: -2, std: 0.5, weight: 0.5 }
const MIX_RIGHT = { mean: 2, std: 0.5, weight: 0.5 }

function gauss(x: number, mu: number, sigma: number) {
  return (
    Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma)) /
    (sigma * Math.sqrt(2 * Math.PI))
  )
}

function targetDensity(x: number) {
  return (
    MIX_LEFT.weight * gauss(x, MIX_LEFT.mean, MIX_LEFT.std) +
    MIX_RIGHT.weight * gauss(x, MIX_RIGHT.mean, MIX_RIGHT.std)
  )
}

// Optimal single-Gaussian fit q* under each KL direction.
//
// Forward KL  D_KL(p || q):  moment-matching → μ = E_p[x], σ² = Var_p[x].
//   For our symmetric mixture: μ = 0, σ² = w·(σ_l² + μ_l²) + ... → ≈ 4.25 → σ ≈ 2.06.
// Reverse KL  D_KL(q || p):  mode-seeking → q collapses onto a single mode.
//   The optimal fit centers on one of the two modes with that mode's spread.
const FORWARD_FIT = { mean: 0, std: Math.sqrt(4.25) }
const REVERSE_FIT = { mean: MIX_RIGHT.mean, std: MIX_RIGHT.std }

const panels = [
  {
    title: 'Forward KL',
    subtitle: 'D_KL(p ‖ q) — mode-covering',
    note: 'q spreads to cover both modes of p',
    fit: FORWARD_FIT,
    accent: '#6366f1',
    accentSoft: '#c7d2fe',
    binding: 'SFT' as const,
  },
  {
    title: 'Reverse KL',
    subtitle: 'D_KL(q ‖ p) — mode-seeking',
    note: 'q collapses onto a single mode of p',
    fit: REVERSE_FIT,
    accent: '#dc2626',
    accentSoft: '#fecaca',
    binding: 'RLHF / GRPO KL term' as const,
  },
]

const KLDirectionChart = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const containerWidth = containerRef.current.clientWidth
    const cols = 2
    const gap = 24
    const panelW = (containerWidth - gap) / cols
    const panelH = 280
    const margin = { top: 60, right: 16, bottom: 36, left: 44 }

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', panelH)

    // Shared scales
    const xDomain: [number, number] = [-5, 5]
    const xs = d3.range(xDomain[0], xDomain[1] + 0.05, 0.05)
    const targetVals = xs.map((x) => ({ x, y: targetDensity(x) }))
    const yMaxAcrossAll = Math.max(
      ...targetVals.map((d) => d.y),
      ...xs.map((x) => gauss(x, FORWARD_FIT.mean, FORWARD_FIT.std)),
      ...xs.map((x) => gauss(x, REVERSE_FIT.mean, REVERSE_FIT.std))
    )

    panels.forEach((panel, idx) => {
      const xOff = idx * (panelW + gap)
      const g = svg.append('g').attr('transform', `translate(${xOff},0)`)

      const innerW = panelW - margin.left - margin.right
      const innerH = panelH - margin.top - margin.bottom

      // Panel background
      g.append('rect')
        .attr('width', panelW)
        .attr('height', panelH)
        .attr('rx', 8)
        .attr('fill', '#fafafa')
        .attr('stroke', '#e5e7eb')

      // Title
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '700')
        .style('fill', panel.accent)
        .text(panel.title)

      // Subtitle (the KL formula in plain text)
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 38)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
        .style('fill', '#374151')
        .text(panel.subtitle)

      // Binding tag (SFT / RLHF) right under subtitle
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 52)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-style', 'italic')
        .style('fill', '#6b7280')
        .text(`used in ${panel.binding}`)

      // Plot area
      const chart = g
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleLinear().domain(xDomain).range([0, innerW])
      const y = d3.scaleLinear().domain([0, yMaxAcrossAll * 1.05]).range([innerH, 0])

      // Grid lines
      const yTicks = y.ticks(4)
      chart
        .append('g')
        .selectAll('line')
        .data(yTicks)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)

      // Target distribution p(x) — filled gray (the "data" / "reference" distribution)
      const areaP = d3
        .area<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y0(innerH)
        .y1((d) => y(d.y))
        .curve(d3.curveMonotoneX)

      chart
        .append('path')
        .datum(targetVals)
        .attr('d', areaP)
        .attr('fill', '#9ca3af')
        .attr('fill-opacity', 0.35)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1.5)

      // Fitted distribution q(x) — solid colored line
      const fitVals = xs.map((xi) => ({
        x: xi,
        y: gauss(xi, panel.fit.mean, panel.fit.std),
      }))

      const lineQ = d3
        .line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
        .curve(d3.curveMonotoneX)

      chart
        .append('path')
        .datum(fitVals)
        .attr('d', lineQ)
        .attr('fill', 'none')
        .attr('stroke', panel.accent)
        .attr('stroke-width', 2.5)

      // Light fill under q to make it readable
      const areaQ = d3
        .area<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y0(innerH)
        .y1((d) => y(d.y))
        .curve(d3.curveMonotoneX)

      chart
        .append('path')
        .datum(fitVals)
        .attr('d', areaQ)
        .attr('fill', panel.accentSoft)
        .attr('fill-opacity', 0.35)

      // X axis
      chart
        .append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(0))
        .call((g) => g.select('.domain').attr('stroke', '#9ca3af'))
        .selectAll('text')
        .style('font-size', '10px')
        .style('fill', '#6b7280')

      // Y axis
      chart
        .append('g')
        .call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => d3.format('.2f')(d as number))
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '10px')
        .style('fill', '#6b7280')

      // Y axis label
      chart
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2)
        .attr('y', -34)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#9ca3af')
        .text('density')

      // Inline legend (top-right of plot)
      const legendG = chart
        .append('g')
        .attr('transform', `translate(${innerW - 110},6)`)

      legendG
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 12)
        .attr('height', 8)
        .attr('fill', '#9ca3af')
        .attr('fill-opacity', 0.35)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1)
      legendG
        .append('text')
        .attr('x', 16)
        .attr('y', 8)
        .style('font-size', '10px')
        .style('fill', '#374151')
        .text('p (target)')

      legendG
        .append('line')
        .attr('x1', 0)
        .attr('x2', 12)
        .attr('y1', 18)
        .attr('y2', 18)
        .attr('stroke', panel.accent)
        .attr('stroke-width', 2.5)
      legendG
        .append('text')
        .attr('x', 16)
        .attr('y', 22)
        .style('font-size', '10px')
        .style('fill', '#374151')
        .text('q (best fit)')

      // Note line at bottom of panel
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', panelH - 12)
        .attr('text-anchor', 'middle')
        .style('font-size', '10.5px')
        .style('fill', '#374151')
        .text(panel.note)
    })
  }, [])

  return (
    <figure className="not-prose my-8">
      <div ref={containerRef} className="w-full" />
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> The same bimodal target distribution <em>p</em> (gray) fit by
        a single Gaussian <em>q</em> (colored) under two KL directions.{' '}
        <span style={{ color: '#6366f1' }}>Forward KL</span> minimizes by{' '}
        <em>moment-matching</em> — q stretches to cover both modes, putting probability mass
        between them where p has none. <span style={{ color: '#dc2626' }}>Reverse KL</span>{' '}
        minimizes by <em>mode-seeking</em> — q collapses onto one mode, accepting that it
        misses the other entirely. SFT (cross-entropy with one-hot targets) is the forward-KL
        regime; the explicit KL term in RLHF / GRPO is the reverse-KL regime.
      </figcaption>
    </figure>
  )
}

export default KLDirectionChart
