'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// Category-averaged scores (means of the per-task table within each category).
const AXES = [
  'Theory of Mind',
  'Character Role Play',
  'Social Skill',
  'Learner Sim',
  'User Sim',
  'Persona Sim',
]

const SERIES = [
  { key: 'base', label: 'Base', color: '#94a3b8', values: [0.68, 0.553, 0.277, 0.46, 0.508, 0.43] },
  { key: 'gpt', label: 'GPT-5.4', color: '#f59e0b', values: [0.827, 0.765, 0.3, 0.57, 0.556, 0.64] },
  { key: 'ditto', label: 'Ditto', color: '#10b981', values: [0.887, 0.656, 0.47, 0.56, 0.822, 0.61] },
]

const SoulRadarChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!ref.current || w === 0) return
    ref.current.innerHTML = ''

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = (ms: number) => (reduce ? 0 : ms)

    const size = Math.min(w, 460)
    const height = size
    const cx = w / 2
    const cy = height / 2
    const radius = size / 2 - 70
    const n = AXES.length

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', w)
      .attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)

    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2
    const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius])

    // concentric grid rings
    const rings = [0.25, 0.5, 0.75, 1]
    rings.forEach((rv) => {
      g.append('polygon')
        .attr(
          'points',
          AXES.map((_, i) => {
            const r = rScale(rv)
            return `${Math.cos(angle(i)) * r},${Math.sin(angle(i)) * r}`
          }).join(' ')
        )
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
      g.append('text')
        .attr('x', 4)
        .attr('y', -rScale(rv))
        .style('font-size', '9px')
        .style('fill', '#cbd5e1')
        .text(rv.toFixed(2))
    })

    // spokes + axis labels
    AXES.forEach((ax, i) => {
      const x = Math.cos(angle(i)) * radius
      const yy = Math.sin(angle(i)) * radius
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', yy)
        .attr('stroke', '#e5e7eb')
      const lx = Math.cos(angle(i)) * (radius + 22)
      const ly = Math.sin(angle(i)) * (radius + 22)
      const anchor = Math.abs(Math.cos(angle(i))) < 0.3 ? 'middle' : Math.cos(angle(i)) > 0 ? 'start' : 'end'
      g.append('text')
        .attr('x', lx)
        .attr('y', ly)
        .attr('text-anchor', anchor)
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '500')
        .style('fill', '#475569')
        .text(ax)
    })

    const line = d3
      .lineRadial<number>()
      .angle((_, i) => angle(i) + Math.PI / 2)
      .radius((d) => rScale(d))
      .curve(d3.curveLinearClosed)

    SERIES.forEach((s, si) => {
      const path = g
        .append('path')
        .attr('d', line(s.values))
        .attr('fill', s.color)
        .attr('fill-opacity', s.key === 'ditto' ? 0.18 : 0.08)
        .attr('stroke', s.color)
        .attr('stroke-width', s.key === 'ditto' ? 2.5 : 1.5)
        .attr('stroke-dasharray', s.key === 'gpt' ? '5,3' : 'none')

      const len = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dashoffset', s.key === 'gpt' ? 0 : len)
        .attr('stroke-dasharray', s.key === 'gpt' ? '5,3' : len)
        .transition()
        .duration(dur(900))
        .delay(dur(si * 200))
        .attr('stroke-dashoffset', 0)
        .on('end', function () {
          if (s.key === 'gpt') d3.select(this).attr('stroke-dasharray', '5,3')
        })

      // vertices
      s.values.forEach((v, i) => {
        const vx = Math.cos(angle(i)) * rScale(v)
        const vy = Math.sin(angle(i)) * rScale(v)
        g.append('circle')
          .attr('cx', vx)
          .attr('cy', vy)
          .attr('r', 0)
          .attr('fill', s.color)
          .transition()
          .delay(dur(si * 200 + 700))
          .duration(dur(300))
          .attr('r', s.key === 'ditto' ? 3.5 : 2.5)

        // value labels on the Ditto vertices so the numbers read at a glance
        if (s.key === 'ditto') {
          const outward = 1 + 11 / Math.max(rScale(v), 1)
          g.append('text')
            .attr('x', vx * outward)
            .attr('y', vy * outward)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '10px')
            .style('font-weight', '700')
            .style('font-variant-numeric', 'tabular-nums')
            .style('fill', s.color)
            .style('opacity', 0)
            .text(v.toFixed(2))
            .transition()
            .delay(dur(si * 200 + 900))
            .duration(dur(300))
            .style('opacity', 1)
        }
      })
    })
  }, [w])

  return (
    <figure className="fullwidth not-prose my-8">
      <div className="mb-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-xs text-zinc-600">{s.label}</span>
          </div>
        ))}
      </div>
      <div
        ref={ref}
        className="w-full"
        role="img"
        aria-label="Radar chart over the six SOUL categories comparing the base model, GPT-5.4, and Ditto. Ditto dominates the interactive, socially-grounded axes — Social Skill and User Simulation — while GPT-5.4 still leads on the role-play categories."
      />
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> The same scores collapsed to the six SOUL
        categories. <span style={{ color: '#10b981' }}>Ditto</span> dominates the
        interactive, socially-grounded axes — <em>Social Skill</em> and{' '}
        <em>User Simulation</em> — exactly where a single scalar reward is least
        informative. <span style={{ color: '#f59e0b' }}>GPT-5.4</span> still leads
        on the more &ldquo;knowledge-shaped&rdquo; role-play tasks.
      </figcaption>
    </figure>
  )
}

export default SoulRadarChart
