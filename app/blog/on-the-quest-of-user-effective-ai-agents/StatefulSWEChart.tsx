'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface BenchmarkData {
  model: string
  originalSWE: number
  statefulSWE: number
  method: 'CodeActAgent' | 'TomCodeActAgent' | 'RAGCodeActAgent'
}

const StatefulSWEChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const data: BenchmarkData[] = [
      { model: 'Claude 4', originalSWE: 68.0, statefulSWE: 18.1, method: 'CodeActAgent' },
      { model: 'Claude 4', originalSWE: 68.0, statefulSWE: 38.4, method: 'RAGCodeActAgent' },
      { model: 'Claude 4', originalSWE: 68.0, statefulSWE: 59.7, method: 'TomCodeActAgent' },
      { model: 'Claude 3.7', originalSWE: 60.6, statefulSWE: 18.7, method: 'CodeActAgent' },
      { model: 'Claude 3.7', originalSWE: 60.6, statefulSWE: 14.4, method: 'RAGCodeActAgent' },
      { model: 'Claude 3.7', originalSWE: 60.6, statefulSWE: 46.5, method: 'TomCodeActAgent' },
      { model: 'Qwen3', originalSWE: 64.6, statefulSWE: 14.2, method: 'CodeActAgent' },
      { model: 'Qwen3', originalSWE: 64.6, statefulSWE: 16.9, method: 'RAGCodeActAgent' },
      { model: 'Qwen3', originalSWE: 64.6, statefulSWE: 44.3, method: 'TomCodeActAgent' },
    ]

    const margin = { top: 20, right: 20, bottom: 0, left: 60 }
    const width = 900 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 900 500`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Group data by model
    const models = ['Claude 4', 'Claude 3.7', 'Qwen3']

    // Create x scale for models
    const x0 = d3
      .scaleBand()
      .domain(models)
      .range([0, width])
      .padding(0.2)

    // Create x scale for methods within each model
    const methods = ['CodeActAgent', 'RAGCodeActAgent', 'TomCodeActAgent']
    const x1 = d3
      .scaleBand()
      .domain(methods)
      .range([0, x0.bandwidth()])
      .padding(0.05)

    // Create y scale
    const y = d3
      .scaleLinear()
      .domain([0, 75])
      .range([height, 0])

    // Color scheme
    const colors = {
      CodeActAgent: '#9ca3af',
      TomCodeActAgent: '#f59e0b',
      RAGCodeActAgent: '#1e3a8a',
      baseline: '#e5e7eb'
    }

    // Add baseline bars (Original SWE Bench)
    models.forEach((model) => {
      const modelData = data.find(d => d.model === model)
      if (!modelData) return

      svg
        .append('rect')
        .attr('x', x0(model)!)
        .attr('y', y(modelData.originalSWE))
        .attr('width', x0.bandwidth())
        .attr('height', height - y(modelData.originalSWE))
        .attr('fill', colors.baseline)
        .attr('rx', 4)

      // Add baseline label
      svg
        .append('text')
        .attr('x', x0(model)! + x0.bandwidth() / 2)
        .attr('y', y(modelData.originalSWE) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('fill', '#6b7280')
        .text(`${modelData.originalSWE.toFixed(1)}%`)
    })

    // Add Stateful SWE Bench bars
    models.forEach((model) => {
      const modelData = data.filter(d => d.model === model)

      modelData.forEach((d) => {
        svg
          .append('rect')
          .attr('x', x0(model)! + x1(d.method)!)
          .attr('y', y(d.statefulSWE))
          .attr('width', x1.bandwidth())
          .attr('height', height - y(d.statefulSWE))
          .attr('fill', colors[d.method])
          .attr('rx', 3)

        // Add value labels
        svg
          .append('text')
          .attr('x', x0(model)! + x1(d.method)! + x1.bandwidth() / 2)
          .attr('y', y(d.statefulSWE) - 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '13px')
          .style('font-weight', '500')
          .style('fill', '#111')
          .text(`${d.statefulSWE.toFixed(1)}%`)
      })
    })

    // Add x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('font-size', '14px')
      .style('fill', '#111')

    // Add y-axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(8).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('font-size', '13px')
      .style('fill', '#111')

    // Add y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#111')
      .text('Success Rate (%)')

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(0,${height + 50})`)

    const legendData = [
      { label: 'Original SWE Bench', color: colors.baseline },
      { label: 'CodeActAgent', color: colors.CodeActAgent },
      { label: 'RAGCodeActAgent', color: colors.RAGCodeActAgent },
      { label: 'TomCodeActAgent (Ours)', color: colors.TomCodeActAgent },
    ]

    legendData.forEach((item, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(${i * 190}, 0)`)

      legendRow
        .append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', item.color)
        .attr('rx', 2)

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 11)
        .style('font-size', '13px')
        .style('fill', '#111')
        .text(item.label)
    })

    // Add grid lines
    const gridGroup = svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(8)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .call(g => g.select('.domain').remove()) // Remove the axis line

    gridGroup
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.7)
      .filter((d, i, nodes) => i === nodes.length - 1) // Filter out the top line
      .remove()

    // Move grid lines behind bars
    svg.select('.grid').lower()

  }, [])

  return (
    <figure className="not-prose my-8">
      <svg ref={svgRef} width="100%" height="500" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 4</strong> Agent performance comparison across models. TomCodeAct agent consistently outper-
forms CodeAct agent across both benchmarks and model variants, with the largest performance
gap observed in the Stateful SWE benchmark using Claude Sonnet 4.
      </figcaption>
    </figure>
  )
}

export default StatefulSWEChart
