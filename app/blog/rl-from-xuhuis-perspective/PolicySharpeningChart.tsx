'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// Three snapshots of a next-token distribution over a small vocabulary, illustrating
// what the same model "looks like" at different training stages.
//
// Vocab is 10 plausible continuations to a prompt like "The capital of France is...".
// Probabilities are illustrative — chosen to match the qualitative claims in the post.
const tokens = ['Paris', 'Lyon', 'Nice', 'a', 'the', 'one', 'France', 'just', 'in', 'France,']

// Pretrained: broad — has seen all these tokens in many contexts, prior is diffuse.
const pretrain = [0.18, 0.06, 0.05, 0.14, 0.13, 0.04, 0.10, 0.07, 0.12, 0.11]
// SFT: narrowed onto answer-shaped continuations; "Paris" wins but several remain plausible.
const sft = [0.55, 0.10, 0.06, 0.04, 0.05, 0.02, 0.05, 0.02, 0.06, 0.05]
// RL with reverse-KL anchor: collapses onto the reward-favored mode.
const rl = [0.92, 0.03, 0.01, 0.005, 0.005, 0.005, 0.01, 0.005, 0.005, 0.005]

const stages = [
  {
    name: 'Pretrained',
    subtitle: 'broad prior over plausible tokens',
    data: pretrain,
    color: '#94a3b8',
    colorSoft: '#e2e8f0',
  },
  {
    name: 'After SFT',
    subtitle: 'forward-KL — covers answer-shaped continuations',
    data: sft,
    color: '#6366f1',
    colorSoft: '#c7d2fe',
  },
  {
    name: 'After RL (with KL anchor)',
    subtitle: 'reverse-KL — concentrates on the reward-preferred mode',
    data: rl,
    color: '#dc2626',
    colorSoft: '#fecaca',
  },
]

function entropy(p: number[]) {
  return -p.reduce((s, q) => s + (q > 0 ? q * Math.log(q) : 0), 0)
}

function perplexity(p: number[]) {
  return Math.exp(entropy(p))
}

const PolicySharpeningChart = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const containerWidth = containerRef.current.clientWidth
    const cols = 3
    const gap = 20
    const panelW = (containerWidth - 2 * gap) / cols
    const panelH = 280
    const margin = { top: 70, right: 12, bottom: 56, left: 40 }

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', panelH)

    stages.forEach((stage, idx) => {
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
        .style('font-size', '13px')
        .style('font-weight', '700')
        .style('fill', stage.color)
        .text(stage.name)

      // Subtitle
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 38)
        .attr('text-anchor', 'middle')
        .style('font-size', '10.5px')
        .style('fill', '#6b7280')
        .text(stage.subtitle)

      // Entropy / perplexity badge
      const H = entropy(stage.data)
      const PP = perplexity(stage.data)
      g.append('text')
        .attr('x', panelW / 2)
        .attr('y', 56)
        .attr('text-anchor', 'middle')
        .style('font-size', '10.5px')
        .style('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
        .style('fill', '#374151')
        .text(`H = ${H.toFixed(2)} nats   ·   PPL = ${PP.toFixed(2)}`)

      // Plot area
      const chart = g
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3
        .scaleBand()
        .domain(tokens)
        .range([0, innerW])
        .padding(0.18)

      // Shared y scale across all three panels = 1.0 so the collapse is visible
      const y = d3.scaleLinear().domain([0, 1]).range([innerH, 0])

      // Grid lines
      const yTicks = y.ticks(5)
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

      // Bars
      chart
        .selectAll('.bar')
        .data(stage.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (_, i) => x(tokens[i])!)
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d))
        .attr('height', (d) => innerH - y(d))
        .attr('fill', stage.colorSoft)
        .attr('stroke', stage.color)
        .attr('stroke-width', 1)

      // X axis (token labels, rotated)
      chart
        .append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call((g) => g.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '9px')
        .style('fill', '#6b7280')
        .attr('transform', 'rotate(-35)')
        .style('text-anchor', 'end')

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

      // Y axis label
      chart
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#9ca3af')
        .text('p(token)')
    })
  }, [])

  return (
    <figure className="not-prose my-8">
      <div ref={containerRef} className="w-full" />
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> The same next-token distribution at three training stages.
        Pretraining yields a broad prior. SFT (forward-KL) sharpens onto answer-shaped
        continuations but still keeps several plausible options alive. RL with a reverse-KL
        anchor against SFT (RLHF / GRPO style) collapses mass onto the reward-favored
        mode. Entropy <em>H</em> drops from ~2.21 → ~1.39 → ~0.42 nats, perplexity from
        ~9 → ~4 → ~1.5 — the post-RL policy behaves as if choosing among ~1.5 effective
        options at this position.
      </figcaption>
    </figure>
  )
}

export default PolicySharpeningChart
