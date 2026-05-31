'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

type Row = {
  task: string
  category: string
  base: number
  grpo: number
  ditto: number
  gpt: number
}

// Exact numbers from the SOUL main results table.
const DATA: Row[] = [
  { task: 'FanToM', category: 'Theory of Mind', base: 0.78, grpo: 0.94, ditto: 0.95, gpt: 0.9 },
  { task: 'HiToM', category: 'Theory of Mind', base: 0.58, grpo: 0.77, ditto: 0.78, gpt: 0.7 },
  { task: 'ToMi', category: 'Theory of Mind', base: 0.68, grpo: 0.82, ditto: 0.93, gpt: 0.88 },
  { task: 'CoSER', category: 'Character Role Play', base: 0.435, grpo: 0.541, ditto: 0.512, gpt: 0.659 },
  { task: 'LifeChoices', category: 'Character Role Play', base: 0.67, grpo: 0.69, ditto: 0.8, gpt: 0.87 },
  { task: 'Sotopia', category: 'Social Skill', base: 0.277, grpo: 0.423, ditto: 0.47, gpt: 0.3 },
  { task: 'Mistakes', category: 'Learner Sim', base: 0.46, grpo: 0.58, ditto: 0.56, gpt: 0.57 },
  { task: 'MirrorBench', category: 'User Sim', base: 0.547, grpo: 0.683, ditto: 0.713, gpt: 0.536 },
  { task: 'UserLLM', category: 'User Sim', base: 0.469, grpo: 0.863, ditto: 0.93, gpt: 0.575 },
  { task: 'TwinVoice', category: 'Persona Sim', base: 0.43, grpo: 0.47, ditto: 0.61, gpt: 0.64 },
]

const SERIES = [
  { key: 'base' as const, label: 'Base', color: '#cbd5e1' },
  { key: 'grpo' as const, label: 'GRPO (scalar)', color: '#818cf8' },
  { key: 'ditto' as const, label: 'Ditto (verbal)', color: '#10b981' },
  { key: 'gpt' as const, label: 'GPT-5.4', color: '#f59e0b' },
]

const SoulResultsChart = () => {
  const ref = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
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

    const height = 360
    const margin = { top: 16, right: 16, bottom: 60, left: 40 }
    const innerW = w - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', w)
      .attr('height', height)
      .attr('viewBox', `0 0 ${w} ${height}`)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x0 = d3
      .scaleBand<string>()
      .domain(DATA.map((d) => d.task))
      .range([0, innerW])
      .paddingInner(0.28)
      .paddingOuter(0.1)

    const x1 = d3
      .scaleBand<string>()
      .domain(SERIES.map((s) => s.key))
      .range([0, x0.bandwidth()])
      .padding(0.12)

    const y = d3.scaleLinear().domain([0, 1]).range([innerH, 0])

    // gridlines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#eef0f2')
      .attr('stroke-width', 1)

    // faint category bracket bands at the TOP, above the bars, to group tasks
    // without colliding with the rotated task labels at the bottom.
    const cats = Array.from(new Set(DATA.map((d) => d.category)))
    cats.forEach((cat, ci) => {
      const rows = DATA.filter((d) => d.category === cat)
      const first = x0(rows[0].task)!
      const last = x0(rows[rows.length - 1].task)! + x0.bandwidth()
      if (ci % 2 === 1) {
        g.append('rect')
          .attr('x', first - x0.paddingInner() * x0.step() * 0.25)
          .attr('y', 0)
          .attr('width', last - first + x0.paddingInner() * x0.step() * 0.5)
          .attr('height', innerH)
          .attr('fill', '#f8fafc')
      }
    })

    const taskG = g
      .selectAll('.task')
      .data(DATA)
      .join('g')
      .attr('transform', (d) => `translate(${x0(d.task)},0)`)

    const tip = d3.select(tipRef.current)

    SERIES.forEach((s) => {
      taskG
        .append('rect')
        .attr('x', x1(s.key)!)
        .attr('width', x1.bandwidth())
        .attr('y', innerH)
        .attr('height', 0)
        .attr('rx', 2)
        .attr('fill', s.color)
        .style('cursor', 'pointer')
        .on('mouseenter', function (_, d) {
          d3.select(this).attr('fill', d3.color(s.color)!.darker(0.5).toString())
          const beats = d.ditto > d.gpt
          tip
            .style('opacity', '1')
            .html(
              `<div style="font-weight:600;color:#1e293b">${d.task}</div>` +
                `<div style="color:#64748b;font-size:10px;margin-bottom:4px">${d.category}</div>` +
                `<div style="display:flex;justify-content:space-between;gap:12px"><span style="color:${s.color}">${s.label}</span><span style="font-weight:600;font-variant-numeric:tabular-nums">${d[s.key].toFixed(3)}</span></div>` +
                (s.key === 'ditto'
                  ? `<div style="color:#94a3b8;font-size:10px;margin-top:3px">${beats ? '★ beats GPT-5.4 (' + d.gpt.toFixed(3) + ')' : 'GPT-5.4: ' + d.gpt.toFixed(3)}</div>`
                  : '')
            )
        })
        .on('mousemove', function (event) {
          const [mx, my] = d3.pointer(event, ref.current)
          tip.style('left', `${mx + 14}px`).style('top', `${my + 14}px`)
        })
        .on('mouseleave', function () {
          d3.select(this).attr('fill', s.color)
          tip.style('opacity', '0')
        })
        .transition()
        .duration(dur(750))
        .delay((_, i) => dur(i * 40))
        .attr('y', (d) => y(d[s.key]))
        .attr('height', (d) => innerH - y(d[s.key]))
    })

    // ★ marker where Ditto beats GPT-5.4
    taskG
      .filter((d) => d.ditto > d.gpt)
      .append('text')
      .attr('x', x1('ditto')! + x1.bandwidth() / 2)
      .attr('y', (d) => y(d.ditto) - 6)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#10b981')
      .style('opacity', 0)
      .text('★')
      .transition()
      .delay(dur(800))
      .duration(dur(400))
      .style('opacity', 1)

    // task labels (rotated)
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .selectAll('text')
      .data(DATA)
      .join('text')
      .attr('x', (d) => x0(d.task)! + x0.bandwidth() / 2)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('transform', (d) => `rotate(-30,${x0(d.task)! + x0.bandwidth() / 2},${innerH + 14})`)
      .style('font-size', '11px')
      .style('fill', '#475569')
      .text((d) => d.task)

    // y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.1f')).tickSize(0))
      .call((sel) => sel.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
  }, [w])

  return (
    <figure className="fullwidth not-prose my-8">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-xs text-zinc-600">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="relative w-full overflow-x-auto">
        <div
          ref={ref}
          className="w-full min-w-[560px]"
          role="img"
          aria-label="Grouped bar chart of scores on the ten SOUL benchmark tasks for four systems: base model, scalar-reward GRPO, Ditto, and GPT-5.4. Ditto trained on verbal feedback exceeds GPT-5.4 on six of the ten tasks, raising the average score from 0.533 to 0.726."
        />
        <div
          ref={tipRef}
          className="pointer-events-none absolute z-10 rounded-lg border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-[11px] shadow-md backdrop-blur transition-opacity"
          style={{ opacity: 0, left: 0, top: 0, minWidth: '120px' }}
        />
      </div>
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> Per-task scores across the 10 SOUL benchmarks{' '}
        <span className="text-zinc-400">(hover a bar for exact values)</span>.{' '}
        <span style={{ color: '#10b981' }}>Ditto</span> — trained on{' '}
        <em>verbal</em> feedback — improves over both the base model and the
        scalar-reward GRPO baseline, and a <span style={{ color: '#10b981' }}>★</span>{' '}
        marks the 6 of 10 tasks where it exceeds GPT-5.4. Average score rises from{' '}
        0.533 (base) to 0.726 (Ditto), a 36% relative gain.
      </figcaption>
    </figure>
  )
}

export default SoulResultsChart
