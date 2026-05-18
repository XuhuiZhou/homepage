'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const rewards = [0.9, 0.3, 0.7, 0.1, 0.8, 0.5, 0.6, 0.4]
const groupMean = d3.mean(rewards)! // 0.5375
const batchMean = 0.51 // slightly different to illustrate the concept
const valueFn = 0.58 // PPO critic's learned V(s)

function computeAdvantages(baseline: number, normalize = false) {
  const raw = rewards.map((r) => r - baseline)
  if (!normalize) return raw
  const std = Math.sqrt(d3.mean(raw.map((x) => x * x))!)
  return raw.map((x) => x / (std + 1e-8))
}

const methods = [
  {
    name: 'REINFORCE',
    baseline: 0,
    advantages: computeAdvantages(0),
    color: '#94a3b8',
    description: 'b = 0 (no baseline)',
  },
  {
    name: 'PPO',
    baseline: valueFn,
    advantages: computeAdvantages(valueFn),
    color: '#6366f1',
    description: `b = V(s) ≈ ${valueFn.toFixed(2)} (critic)`,
  },
  {
    name: 'GRPO',
    baseline: groupMean,
    advantages: computeAdvantages(groupMean, true),
    color: '#10b981',
    description: `b = group mean ≈ ${groupMean.toFixed(2)}`,
  },
  {
    name: 'REINFORCE++',
    baseline: batchMean,
    advantages: computeAdvantages(batchMean),
    color: '#f59e0b',
    description: `b = batch mean ≈ ${batchMean.toFixed(2)}`,
  },
]

const AdvantageEstimationChart = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const containerWidth = containerRef.current.clientWidth
    const cols = 2
    const rows = 2
    const gap = 24
    const panelW = (containerWidth - gap) / cols
    const panelH = 200
    const margin = { top: 48, right: 16, bottom: 36, left: 44 }

    const totalH = rows * panelH + (rows - 1) * gap

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', totalH)

    methods.forEach((method, idx) => {
      const col = idx % cols
      const row = Math.floor(idx / cols)
      const xOff = col * (panelW + gap)
      const yOff = row * (panelH + gap)

      const g = svg
        .append('g')
        .attr('transform', `translate(${xOff},${yOff})`)

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
        .attr('y', 16)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '700')
        .style('fill', method.color)
        .text(method.name)

      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '10.5px')
        .style('fill', '#6b7280')
        .text(method.description)

      const chart = g
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // Y scale: center on the advantages
      const allAdv = method.advantages
      const yAbsMax = Math.max(Math.abs(d3.min(allAdv)!), Math.abs(d3.max(allAdv)!)) * 1.15
      const y = d3
        .scaleLinear()
        .domain([-yAbsMax, yAbsMax])
        .range([innerH, 0])

      // X scale
      const x = d3
        .scaleBand()
        .domain(rewards.map((_, i) => String(i + 1)))
        .range([0, innerW])
        .padding(0.25)

      // Grid lines
      const ticks = y.ticks(4)
      chart
        .append('g')
        .selectAll('line')
        .data(ticks)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)

      // Zero line
      chart
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke', '#374151')
        .attr('stroke-width', 1.5)

      // Advantage bars
      chart
        .selectAll('.bar')
        .data(allAdv)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (_, i) => x(String(i + 1))!)
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(Math.max(d, 0)))
        .attr('height', (d) => Math.abs(y(d) - y(0)))
        .attr('fill', (d) => (d >= 0 ? '#86efac' : '#fca5a5'))
        .attr('stroke', (d) => (d >= 0 ? '#16a34a' : '#dc2626'))
        .attr('stroke-width', 1)

      // Reward labels on bars
      chart
        .selectAll('.reward-label')
        .data(allAdv)
        .enter()
        .append('text')
        .attr('class', 'reward-label')
        .attr('x', (_, i) => x(String(i + 1))! + x.bandwidth() / 2)
        .attr('y', (d) =>
          d >= 0 ? y(d) - 3 : y(d) + 11
        )
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .style('fill', '#374151')
        .text((d) => (d >= 0 ? `+${d.toFixed(2)}` : d.toFixed(2)))

      // X axis
      chart
        .append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call((g) => g.select('.domain').remove())
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
            .tickFormat((d) => d3.format('.1f')(d as number))
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '10px')
        .style('fill', '#6b7280')

      // "Advantage" label on y axis
      chart
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2)
        .attr('y', -34)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#9ca3af')
        .text('Advantage')
    })
  }, [])

  return (
    <figure className="not-prose my-8">
      <div ref={containerRef} className="w-full" />
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure 1:</strong> How four RL algorithms estimate the advantage for the same 8 rollouts with
        rewards [0.9, 0.3, 0.7, 0.1, 0.8, 0.5, 0.6, 0.4]. Green = positive advantage; red = negative.
        REINFORCE has all-positive advantages since its baseline is zero. GRPO also normalizes by group std.
      </figcaption>
    </figure>
  )
}

export default AdvantageEstimationChart
