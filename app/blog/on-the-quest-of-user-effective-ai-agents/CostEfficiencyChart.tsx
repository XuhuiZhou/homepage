'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  model: string
  cost: number
  resolvedRate: number
  family: 'w/o ToM' | 'GPT-5' | 'Claude'
}

const CostEfficiencyChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const data: DataPoint[] = [
      { model: 'w/o ToM', cost: 0.001, resolvedRate: 18, family: 'w/o ToM' },
      { model: 'GPT-5 nano', cost: 0.02, resolvedRate: 38, family: 'GPT-5' },
      { model: 'GPT-5 mini', cost: 0.09, resolvedRate: 42, family: 'GPT-5' },
      { model: 'GPT-5', cost: 0.13, resolvedRate: 56, family: 'GPT-5' },
      { model: 'Claude 3.7', cost: 0.18, resolvedRate: 48, family: 'Claude' },
      { model: 'Claude 4', cost: 0.17, resolvedRate: 59, family: 'Claude' },
    ]

    const margin = { top: 20, right: 120, bottom: 60, left: 60 }
    const width = 900 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 900 500`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const x = d3
      .scaleLinear()
      .domain([0, 0.21])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, 70])
      .range([height, 0])

    // Color scheme
    const colors = {
      'w/o ToM': '#9ca3af',
      'GPT-5': '#ec4899',
      'Claude': '#14b8a6',
    }

    // Add grid lines
    const gridGroup = svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(7)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .call(g => g.select('.domain').remove())

    gridGroup
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.7)
      .filter((d, i, nodes) => i === nodes.length - 1)
      .remove()

    svg.select('.grid').lower()

    // Add x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d.valueOf().toFixed(3)}`))
      .selectAll('text')
      .style('font-size', '13px')
      .style('fill', '#111')

    // Add y-axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(7))
      .selectAll('text')
      .style('font-size', '13px')
      .style('fill', '#111')

    // Add x-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#111')
      .text('Avg. cost per session ($)')

    // Add y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#111')
      .text('Resolved rate (%)')

    // Add trend line for GPT-5 family
    const gptData = data.filter(d => d.family === 'GPT-5')
    const lineGenerator = d3
      .line<DataPoint>()
      .x(d => x(d.cost))
      .y(d => y(d.resolvedRate))

    svg
      .append('path')
      .datum(gptData)
      .attr('fill', 'none')
      .attr('stroke', '#f97316')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineGenerator)

    // Add data points
    data.forEach((d) => {
      svg
        .append('circle')
        .attr('cx', x(d.cost))
        .attr('cy', y(d.resolvedRate))
        .attr('r', 8)
        .attr('fill', colors[d.family])
        .attr('opacity', 0.8)

      // Add labels
      const labelOffset = d.model === 'w/o ToM' ? -15 :
                         d.model === 'Claude 3.7' ? 15 :
                         d.model === 'Claude 4' ? -15 : 15

      svg
        .append('text')
        .attr('x', x(d.cost) + labelOffset)
        .attr('y', y(d.resolvedRate) + (d.model === 'GPT-5 nano' || d.model === 'w/o ToM' ? 5 : -10))
        .attr('text-anchor', labelOffset < 0 ? 'end' : 'start')
        .style('font-size', '13px')
        .style('fill', '#111')
        .text(d.model)
    })

    // Add inset bar chart
    const insetX = width - 250
    const insetY = height - 200
    const insetWidth = 150
    const insetHeight = 120

    // Bar chart data
    const barData = [
      { label: 'SWE avg', value: 1.08, color: '#6b7280' },
      { label: 'ToM (Claude 4)', value: 0.17, color: '#14b8a6', annotation: '≈16% of SWE' },
    ]

    const barX = d3
      .scaleBand()
      .domain(barData.map(d => d.label))
      .range([0, insetWidth])
      .padding(0.3)

    const barY = d3
      .scaleLinear()
      .domain([0, 1.2])
      .range([insetHeight, 0])

    const insetGroup = svg
      .append('g')
      .attr('transform', `translate(${insetX},${insetY})`)

    // Add bars
    barData.forEach((d) => {
      insetGroup
        .append('rect')
        .attr('x', barX(d.label)!)
        .attr('y', barY(d.value))
        .attr('width', barX.bandwidth())
        .attr('height', insetHeight - barY(d.value))
        .attr('fill', d.color)
        .attr('rx', 2)

      // Add value labels on bars
      insetGroup
        .append('text')
        .attr('x', barX(d.label)! + barX.bandwidth() / 2)
        .attr('y', barY(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', '#111')
        .text(`$${d.value.toFixed(2)}`)

      // Add annotation
      if (d.annotation) {
        insetGroup
          .append('text')
          .attr('x', barX(d.label)! + barX.bandwidth() / 2)
          .attr('y', insetHeight + 25)
          .attr('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('fill', '#6b7280')
          .text(d.annotation)
      }
    })

    // Add x-axis to inset
    insetGroup
      .append('g')
      .attr('transform', `translate(0,${insetHeight})`)
      .call(d3.axisBottom(barX).tickSize(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#111')

    // Add y-axis to inset
    insetGroup
      .append('g')
      .call(d3.axisLeft(barY).ticks(4).tickFormat(d => d.valueOf().toFixed(1)))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#111')

    // Add y-axis label to inset
    insetGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -insetHeight / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#111')
      .text('$ per session')

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width + 20},${height / 2})`)

    const legendData = [
      { label: 'w/o ToM', color: colors['w/o ToM'] },
      { label: 'GPT-5', color: colors['GPT-5'] },
      { label: 'Claude', color: colors['Claude'] },
    ]

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', -20)
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', '#111')
      .text('Model family')

    legendData.forEach((item, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 25})`)

      legendRow
        .append('circle')
        .attr('cx', 6)
        .attr('cy', 0)
        .attr('r', 6)
        .attr('fill', item.color)
        .attr('opacity', 0.8)

      legendRow
        .append('text')
        .attr('x', 18)
        .attr('y', 4)
        .style('font-size', '12px')
        .style('fill', '#111')
        .text(item.label)
    })

  }, [])

  return (
    <figure className="not-prose my-8">
      <svg ref={svgRef} width="100%" height="500" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 5</strong> Resolved rate vs avg. cost with ToM agents models solving per instance. The scatter plot shows the trade-off between cost and performance across different model families, with an inset bar chart comparing average costs. ToM-enabled Claude 4 achieves the highest resolved rate while maintaining reasonable costs at approximately 16% of the SWE average cost.
      </figcaption>
    </figure>
  )
}

export default CostEfficiencyChart
