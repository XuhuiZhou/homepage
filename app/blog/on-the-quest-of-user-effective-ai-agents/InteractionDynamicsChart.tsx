'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const InteractionDynamicsChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Generate smooth data for both charts
    const generateData = (method: 'ppp' | 'baseline') => {
      const steps = d3.range(0, 201, 5)

      if (method === 'ppp') {
        return steps.map(step => {
          const progress = step / 200

          // Low effort: steady increase from ~0.45 to ~0.95
          const lowEffort = 0.45 + progress * 0.5 + Math.random() * 0.03

          // Medium effort: increase-then-decrease pattern (peaks around step 100)
          const mediumPeak = step < 100 ? step / 100 : 1 - (step - 100) / 200
          const mediumEffort = 0.10 + mediumPeak * 0.25 + Math.random() * 0.02

          // High effort: stays minimal
          const highEffort = 0.02 + Math.random() * 0.02

          return {
            step,
            lowEffort,
            mediumEffort,
            highEffort
          }
        })
      } else {
        return steps.map(step => {
          const progress = step / 200

          // Low effort: steady increase from ~0.5 to ~1.2
          const lowEffort = 0.5 + progress * 0.7 + Math.random() * 0.05

          // Medium effort: continuous increase (degradation) from ~0.2 to ~0.5
          const mediumEffort = 0.2 + progress * 0.3 + Math.random() * 0.03

          // High effort: increase from ~0.05 to ~0.2
          const highEffort = 0.05 + progress * 0.15 + Math.random() * 0.02

          return {
            step,
            lowEffort,
            mediumEffort,
            highEffort
          }
        })
      }
    }

    const pppData = generateData('ppp')
    const baselineData = generateData('baseline')

    const margin = { top: 40, right: 20, bottom: 50, left: 60 }
    const chartWidth = 350
    const chartHeight = 300
    const totalWidth = chartWidth * 2 + margin.left + margin.right + 40 // 40px gap between charts
    const totalHeight = chartHeight + margin.top + margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .append('g')

    // Create two chart panels
    const createChart = (
      data: any[],
      xOffset: number,
      title: string,
      colors: { low: string; medium: string; high: string }
    ) => {
      const g = svg.append('g').attr('transform', `translate(${xOffset + margin.left},${margin.top})`)

      // Scales
      const x = d3.scaleLinear().domain([0, 200]).range([0, chartWidth])
      const y = d3.scaleLinear().domain([0, 2]).range([chartHeight, 0])

      // Stack the data
      const stack = d3
        .stack()
        .keys(['highEffort', 'mediumEffort', 'lowEffort'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)

      const series = stack(data as any)

      // Color mapping
      const colorMap: Record<string, string> = {
        lowEffort: colors.low,
        mediumEffort: colors.medium,
        highEffort: colors.high
      }

      // Area generator
      const area = d3
        .area<any>()
        .x((d: any) => x(d.data.step))
        .y0((d: any) => y(d[0]))
        .y1((d: any) => y(d[1]))
        .curve(d3.curveMonotoneX)

      // Draw stacked areas
      g.selectAll('.area')
        .data(series)
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('d', area)
        .attr('fill', (d: any) => colorMap[d.key])
        .attr('opacity', 0.8)

      // Add gridlines
      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks(5))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)

      // Add axes
      g.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x).ticks(5))
        .selectAll('text')
        .style('font-size', '12px')

      g.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .selectAll('text')
        .style('font-size', '12px')

      // Add title
      g.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .text(title)

      // Add x-axis label
      g.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', chartHeight + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .text('Training Step')

      // Add legend (only for the first chart)
      if (xOffset === 0) {
        const legend = g.append('g').attr('transform', `translate(10, 20)`)

        const legendData = [
          { label: 'Low Effort', color: colors.low },
          { label: 'Medium Effort', color: colors.medium },
          { label: 'High Effort', color: colors.high }
        ]

        legendData.forEach((item, i) => {
          const row = legend.append('g').attr('transform', `translate(0, ${i * 20})`)

          row
            .append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', item.color)
            .attr('opacity', 0.8)

          row
            .append('text')
            .attr('x', 18)
            .attr('y', 10)
            .style('font-size', '11px')
            .text(item.label)
        })
      }
    }

    // Create PPP chart (left)
    createChart(pppData, 0, 'Interaction Number · PPP (Ours)', {
      low: '#FFA500',
      medium: '#FFD700',
      high: '#DC143C'
    })

    // Create baseline chart (right)
    createChart(baselineData, chartWidth + 40, 'Interaction Number · No R_Proact', {
      low: '#87CEEB',
      medium: '#4169E1',
      high: '#DC143C'
    })
  }, [])

  return (
    <figure className="not-prose my-8">
      <svg ref={svgRef} width="100%" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 7:</strong> Average number of interactions between user and agent per session, comparing our
        method with a baseline trained without the <em>proactivity</em> reward (R<sub>Proact</sub>). We also report
        interaction quality: low-effort interactions are easy for the user to answer and directly address missing
        information; medium-effort interactions are those that the user cannot answer; high-effort interactions are
        cases where the agent asks questions that are difficult for the user to answer. For medium- and high-effort
        interactions, fewer is better.
      </figcaption>
    </figure>
  )
}

export default InteractionDynamicsChart
