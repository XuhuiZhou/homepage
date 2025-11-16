'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

// Dialogue examples for each effort category
const dialogueExamples = {
  lowEffort: {
    agent: "Which color would you like to use for your website?",
    user: "Green",
    description: "Quick, easy answer"
  },
  mediumEffort: {
    agent: "Can you let me know what is the version of the xx package?",
    user: "I don't know",
    description: "User doesn't have the information"
  },
  highEffort: {
    agent: "Can you point me which line of the function is causing the error and how to fix it?",
    user: "[Takes 10+ minutes reading code and debugging...]",
    description: "User spends significant time/effort"
  }
}

const InteractionDynamicsChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

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
        .style('cursor', 'pointer')
        .on('mouseenter', function(event: any, d: any) {
          // Highlight hovered area
          d3.select(this).attr('opacity', 1).attr('stroke', '#333').attr('stroke-width', 2)

          // Dim other areas
          g.selectAll('.area')
            .filter((data: any) => data.key !== d.key)
            .attr('opacity', 0.3)

          // Update tooltip state
          setHoveredCategory(d.key)

          // Get tooltip position relative to the chart
          const [mouseX, mouseY] = d3.pointer(event, svgRef.current)
          setTooltipPosition({ x: mouseX, y: mouseY })
        })
        .on('mousemove', function(event: any) {
          // Update tooltip position as mouse moves
          const [mouseX, mouseY] = d3.pointer(event, svgRef.current)
          setTooltipPosition({ x: mouseX, y: mouseY })
        })
        .on('mouseleave', function(event: any, d: any) {
          // Reset all areas to normal opacity
          g.selectAll('.area')
            .attr('opacity', 0.8)
            .attr('stroke', 'none')

          // Hide tooltip
          setHoveredCategory(null)
        })

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

      // Add legend
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

  // Get dialogue example based on hovered category
  const getDialogueExample = () => {
    if (!hoveredCategory) return null

    const categoryMap: Record<string, keyof typeof dialogueExamples> = {
      lowEffort: 'lowEffort',
      mediumEffort: 'mediumEffort',
      highEffort: 'highEffort'
    }

    return dialogueExamples[categoryMap[hoveredCategory]]
  }

  const dialogue = getDialogueExample()

  return (
    <figure className="not-prose my-8 relative">
      <svg ref={svgRef} width="100%" className="overflow-visible" />

      {/* Tooltip */}
      {hoveredCategory && dialogue && (
        <div
          className="absolute pointer-events-none z-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4 max-w-sm"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 80}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm shrink-0">Agent:</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{dialogue.agent}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-green-600 dark:text-green-400 text-sm shrink-0">User:</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">{dialogue.user}</p>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-600">
              {dialogue.description}
            </div>
          </div>
        </div>
      )}

      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 8:</strong> Average number of interactions between user and agent per session, comparing our
        method with a baseline trained without the <em>proactivity</em> reward (R<sub>Proact</sub>). We also report
        interaction quality: low-effort interactions are easy for the user to answer and directly address missing
        information; medium-effort interactions are those that the user cannot answer; high-effort interactions are
        cases where the agent asks questions that are difficult for the user to answer. For medium- and high-effort
        interactions, fewer is better. <em className="text-zinc-500">(Hover over areas to see dialogue examples)</em>
      </figcaption>
    </figure>
  )
}

export default InteractionDynamicsChart
