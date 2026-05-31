'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// Illustrative training dynamics: the feedback-conditioned teacher (y₁) stays
// ahead of the student (y₀), and the gap *widens* — so the teacher remains a
// useful learning target throughout, while the student rises toward it.
const STEPS = 40
function curve(base: number, amp: number, rate: number, noiseSeed: number) {
  return d3.range(STEPS).map((i) => {
    const t = i / (STEPS - 1)
    const wobble = Math.sin(i * 1.7 + noiseSeed) * 0.012
    return { step: i, v: base + amp * (1 - Math.exp(-rate * t)) + wobble }
  })
}

const STUDENT = curve(0.3, 0.27, 3.2, 0.5) // y₀ : 0.30 → ~0.55
const TEACHER = curve(0.42, 0.34, 3.6, 2.1) // y₁ : 0.42 → ~0.74

const TeacherStudentGapChart = () => {
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

    const height = 320
    const margin = { top: 20, right: 90, bottom: 40, left: 44 }
    const innerW = w - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3.select(ref.current).append('svg').attr('width', w).attr('height', height)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, STEPS - 1]).range([0, innerW])
    const y = d3.scaleLinear().domain([0.25, 0.8]).range([innerH, 0])

    g.append('g')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#eef0f2')

    // gap band between teacher and student
    const area = d3
      .area<{ step: number; v: number }>()
      .x((d) => x(d.step))
      .y0((_, i) => y(STUDENT[i].v))
      .y1((d) => y(d.v))
      .curve(d3.curveMonotoneX)
    g.append('path')
      .datum(TEACHER)
      .attr('d', area)
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.1)

    const mkLine = d3
      .line<{ step: number; v: number }>()
      .x((d) => x(d.step))
      .y((d) => y(d.v))
      .curve(d3.curveMonotoneX)

    const draw = (data: typeof STUDENT, color: string, dash: string, label: string, delay: number) => {
      const p = g
        .append('path')
        .datum(data)
        .attr('d', mkLine)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', dash || 'none')
      const len = (p.node() as SVGPathElement).getTotalLength()
      if (!dash) {
        p.attr('stroke-dasharray', len)
          .attr('stroke-dashoffset', len)
          .transition()
          .duration(dur(1100))
          .delay(dur(delay))
          .attr('stroke-dashoffset', 0)
      }
      g.append('text')
        .attr('x', innerW + 8)
        .attr('y', y(data[data.length - 1].v) + 4)
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', color)
        .text(label)
    }

    draw(TEACHER, '#10b981', '', 'Teacher y₁', 200)
    draw(STUDENT, '#818cf8', '', 'Student y₀', 0)

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0))
      .call((s) => s.select('.domain').attr('stroke', '#cbd5e1'))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
    g.append('text')
      .attr('x', innerW / 2)
      .attr('y', innerH + 34)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#94a3b8')
      .text('training step →')

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.1f')).tickSize(0))
      .call((s) => s.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
  }, [w])

  return (
    <figure className="fullwidth not-prose my-8">
      <div
        ref={ref}
        className="w-full"
        role="img"
        aria-label="Line chart of training dynamics: the feedback-conditioned teacher rollout stays above the student rollout throughout training, and the gap between them widens rather than closing."
      />
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure (schematic):</strong> Throughout training the
        feedback-conditioned <span style={{ color: '#10b981' }}>teacher</span>{' '}
        rollout stays ahead of the <span style={{ color: '#818cf8' }}>student</span>,
        and the gap (shaded) widens rather than closing. That persistent gap is
        what makes verbal feedback a renewable training target — the teacher
        keeps showing the student a better response to imitate.
      </figcaption>
    </figure>
  )
}

export default TeacherStudentGapChart
