'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Spread rewards wider apart to avoid label overlap
const samples = [
  { r: 0.95, dy1: 35, dy2: -8 },
  { r: 0.78, dy1: -20, dy2: 12 },
  { r: 0.62, dy1: 15, dy2: -10 },
  { r: 0.48, dy1: -55, dy2: 20 },
  { r: 0.35, dy1: 40, dy2: -16 },
  { r: 0.18, dy1: -70, dy2: 28 },
]

const qPi = d3.mean(samples, (d) => d.r)! // ≈ 0.56

export default function MonteCarloChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''

    const W = ref.current.clientWidth || 640
    const H = 360
    const sx = 80
    const sy = H / 2
    const ex = W * 0.55 // endpoints at ~55% width, leaving room for labels + Q annotation

    const yScale = d3.scaleLinear().domain([0, 1]).range([H - 50, 50])
    const color = d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1])

    const svg = d3.select(ref.current).append('svg').attr('width', W).attr('height', H)

    // ── top label ─────────────────────────────────────────────────────
    svg
      .append('text')
      .attr('x', sx + (ex - sx) / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
      .style('font-style', 'italic')
      .text('stochastic future — same start, different outcomes')

    // ── trajectory curves ─────────────────────────────────────────────
    samples.forEach((s) => {
      const ey = yScale(s.r)
      const path = d3.path()
      path.moveTo(sx, sy)
      path.bezierCurveTo(
        sx + (ex - sx) * 0.35,
        sy + s.dy1,
        sx + (ex - sx) * 0.65,
        ey + s.dy2,
        ex,
        ey
      )
      svg
        .append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', color(s.r))
        .attr('stroke-width', 2)
        .attr('opacity', 0.55)
    })

    // ── starting node ─────────────────────────────────────────────────
    svg
      .append('circle')
      .attr('cx', sx)
      .attr('cy', sy)
      .attr('r', 28)
      .attr('fill', '#f1f5f9')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.5)

    svg
      .append('text')
      .attr('x', sx)
      .attr('y', sy + 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .style('font-weight', '600')
      .text('s, a')

    svg
      .append('text')
      .attr('x', sx)
      .attr('y', sy + 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '8.5px')
      .style('fill', '#94a3b8')
      .text('(fixed)')

    // ── endpoint dots + R labels ──────────────────────────────────────
    const sorted = [...samples].sort((a, b) => b.r - a.r)

    sorted.forEach((s) => {
      const ey = yScale(s.r)

      svg
        .append('circle')
        .attr('cx', ex)
        .attr('cy', ey)
        .attr('r', 5)
        .attr('fill', color(s.r))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)

      svg
        .append('text')
        .attr('x', ex + 12)
        .attr('y', ey + 4)
        .style('font-size', '11px')
        .style('fill', '#374151')
        .text(`R = ${s.r.toFixed(2)}`)
    })

    // ── vertical axis line for context ────────────────────────────────
    svg
      .append('line')
      .attr('x1', ex)
      .attr('x2', ex)
      .attr('y1', yScale(1) - 5)
      .attr('y2', yScale(0) + 5)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)

    // ── Q^π annotation — placed in its own column to the far right ───
    const qx = W * 0.78 // separate column for Q label
    const my = yScale(qPi)

    // Dashed line from dots to Q annotation
    svg
      .append('line')
      .attr('x1', ex + 80)
      .attr('x2', qx - 8)
      .attr('y1', my)
      .attr('y2', my)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')

    // Arrow head
    svg
      .append('path')
      .attr('d', `M${qx - 8},${my - 4} L${qx},${my} L${qx - 8},${my + 4}`)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5)

    // Q^π box
    const boxW = W * 0.22 - 10
    const boxH = 52
    const boxX = qx + 2
    const boxY = my - boxH / 2

    svg
      .append('rect')
      .attr('x', boxX)
      .attr('y', boxY)
      .attr('width', boxW)
      .attr('height', boxH)
      .attr('rx', 6)
      .attr('fill', '#eff6ff')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1)

    svg
      .append('text')
      .attr('x', boxX + boxW / 2)
      .attr('y', boxY + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#1d4ed8')
      .style('font-weight', '700')
      .text('E[ R | s, a ]')

    svg
      .append('text')
      .attr('x', boxX + boxW / 2)
      .attr('y', boxY + 38)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#3b82f6')
      .text(`= Q\u03C0(s, a) \u2248 ${qPi.toFixed(2)}`)

    // ── mean marker on dot column ─────────────────────────────────────
    svg
      .append('line')
      .attr('x1', ex - 8)
      .attr('x2', ex + 80)
      .attr('y1', my)
      .attr('y2', my)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')

    svg
      .append('circle')
      .attr('cx', ex)
      .attr('cy', my)
      .attr('r', 7)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    svg
      .append('text')
      .attr('x', ex + 12)
      .attr('y', my + 4)
      .style('font-size', '10px')
      .style('fill', '#3b82f6')
      .style('font-weight', '600')
      .text('mean')

    // ── bottom annotation ─────────────────────────────────────────────
    svg
      .append('text')
      .attr('x', ex)
      .attr('y', H - 12)
      .attr('text-anchor', 'middle')
      .style('font-size', '9.5px')
      .style('fill', '#94a3b8')
      .text('each dot = one rollout\u2019s R (a sample of Q\u03C0)')
  }, [])

  return (
    <figure className="not-prose my-8">
      <div ref={ref} className="w-full" />
      <figcaption className="mt-3 text-center text-sm text-zinc-500">
        <strong>Figure 2:</strong> From the same (s, a), different rollouts yield
        different returns R due to stochastic transitions. Q<sup>&pi;</sup>(s, a)
        is the <em>expectation</em> over all possible returns. Any single
        rollout&rsquo;s R is one noisy sample of that expectation &mdash; Monte
        Carlo estimation.
      </figcaption>
    </figure>
  )
}
