'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  step: number
  value: number
}

interface PlotData {
  ppp: DataPoint[]
  baseline: DataPoint[]
}

const RLCurvePlot = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Approximate data from the image
  const productivityData: PlotData = {
    ppp: [
      { step: 0, value: 39 },
      { step: 20, value: 49 },
      { step: 40, value: 51 },
      { step: 60, value: 52 },
      { step: 80, value: 53 },
      { step: 100, value: 54 },
      { step: 120, value: 54.5 },
      { step: 140, value: 55 },
      { step: 160, value: 56 },
      { step: 180, value: 56.5 },
      { step: 200, value: 57 },
      { step: 220, value: 57.5 },
    ],
    baseline: [
      { step: 0, value: 40 },
      { step: 20, value: 50 },
      { step: 40, value: 52 },
      { step: 60, value: 53 },
      { step: 80, value: 54 },
      { step: 100, value: 54.5 },
      { step: 120, value: 55.5 },
      { step: 140, value: 56 },
      { step: 160, value: 56.5 },
      { step: 180, value: 56 },
      { step: 200, value: 57 },
      { step: 220, value: 57.5 },
    ],
  }

  const proactivityData: PlotData = {
    ppp: [
      { step: 0, value: 44 },
      { step: 20, value: 52 },
      { step: 40, value: 64 },
      { step: 60, value: 68 },
      { step: 80, value: 69 },
      { step: 100, value: 70 },
      { step: 120, value: 71 },
      { step: 140, value: 73 },
      { step: 160, value: 75 },
      { step: 180, value: 75.5 },
      { step: 200, value: 76 },
      { step: 220, value: 76 },
    ],
    baseline: [
      { step: 0, value: 44 },
      { step: 20, value: 45 },
      { step: 40, value: 54 },
      { step: 60, value: 59 },
      { step: 80, value: 60 },
      { step: 100, value: 59 },
      { step: 120, value: 61 },
      { step: 140, value: 59 },
      { step: 160, value: 58 },
      { step: 180, value: 57 },
      { step: 200, value: 55 },
      { step: 220, value: 42 },
    ],
  }

  const personalizationData: PlotData = {
    ppp: [
      { step: 0, value: 59 },
      { step: 20, value: 68 },
      { step: 40, value: 80 },
      { step: 60, value: 85 },
      { step: 80, value: 87 },
      { step: 100, value: 88 },
      { step: 120, value: 88.5 },
      { step: 140, value: 89 },
      { step: 160, value: 89 },
      { step: 180, value: 89 },
      { step: 200, value: 89 },
      { step: 220, value: 89 },
    ],
    baseline: [
      { step: 0, value: 59 },
      { step: 20, value: 73 },
      { step: 40, value: 68 },
      { step: 60, value: 69 },
      { step: 80, value: 68 },
      { step: 100, value: 66 },
      { step: 120, value: 67 },
      { step: 140, value: 66 },
      { step: 160, value: 67 },
      { step: 180, value: 65 },
      { step: 200, value: 62 },
      { step: 220, value: 57 },
    ],
  }

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
    const containerWidth = svgRef.current.clientWidth
    const margin = { top: 20, right: 20, bottom: 60, left: 60 }
    const plotWidth = (containerWidth - margin.left - margin.right) / 3 - 30
    const plotHeight = 250

    const datasets = [
      { data: productivityData, title: 'Productivity Score', yDomain: [38, 58] },
      { data: proactivityData, title: 'Proactivity Score', yDomain: [40, 80] },
      { data: personalizationData, title: 'Personalization Score', yDomain: [55, 92] },
    ]

    datasets.forEach((dataset, idx) => {
      const xOffset = margin.left + idx * (plotWidth + 50)

      const g = svg.append('g').attr('transform', `translate(${xOffset},${margin.top})`)

      // Scales
      const x = d3.scaleLinear().domain([0, 220]).range([0, plotWidth])

      const y = d3.scaleLinear().domain(dataset.yDomain).range([plotHeight, 0])

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks())
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', plotWidth)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)

      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(x.ticks())
        .enter()
        .append('line')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', 0)
        .attr('y2', plotHeight)
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)

      // Line generators
      const line = d3
        .line<DataPoint>()
        .x((d) => x(d.step))
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX)

      // Draw PPP line (orange)
      g.append('path')
        .datum(dataset.data.ppp)
        .attr('fill', 'none')
        .attr('stroke', '#f97316')
        .attr('stroke-width', 2.5)
        .attr('d', line)

      // Draw baseline line (blue)
      g.append('path')
        .datum(dataset.data.baseline)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2.5)
        .attr('d', line)

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${plotHeight})`)
        .call(d3.axisBottom(x).ticks(5))
        .style('font-size', '12px')

      g.append('g').call(d3.axisLeft(y).ticks(6)).style('font-size', '12px')

      // Title
      g.append('text')
        .attr('x', plotWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(dataset.title)

      // X-axis label
      g.append('text')
        .attr('x', plotWidth / 2)
        .attr('y', plotHeight + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Training Step')
    })

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${containerWidth / 2 - 200},${plotHeight + margin.top + 60})`)

    legend
      .append('line')
      .attr('x1', 0)
      .attr('x2', 40)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#f97316')
      .attr('stroke-width', 2.5)

    legend.append('text').attr('x', 50).attr('y', 5).style('font-size', '14px').text('PPP (Ours)')

    legend
      .append('line')
      .attr('x1', 200)
      .attr('x2', 240)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2.5)

    legend
      .append('text')
      .attr('x', 250)
      .attr('y', 5)
      .style('font-size', '14px')
      .text('Only Task Success Reward')
  }, [])

  return (
    <figure className="not-prose my-8 fullwidth">
      <svg ref={svgRef} width="100%" height="350" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 1</strong> While optimizing only for the task success, the productivity score improves at the cost of proactivity and personalization. The red line represents the method we proposed (See xx), which jointly optimizes for the productivity, proactivity and personalization.
      </figcaption>
    </figure>
  )
}

export default RLCurvePlot
