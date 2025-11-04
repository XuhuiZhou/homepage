'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ModelData {
  model: string
  accuracy: number
  fpr: number
  fnr: number
}

const ModelComparisonChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  const data: ModelData[] = [
    { model: 'Claude Sonnet 3.5', accuracy: 0.60, fpr: 0.00, fnr: 0.81 },
    { model: 'Claude Haiku 3.5', accuracy: 0.54, fpr: 0.00, fnr: 0.97 },
    { model: 'Deepseek-v2', accuracy: 0.69, fpr: 0.30, fnr: 0.31 },
    { model: 'Llama 3.1 70B', accuracy: 0.48, fpr: 0.46, fnr: 0.57 },
  ]

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
    const containerWidth = svgRef.current.clientWidth
    const margin = { top: 40, right: 120, bottom: 80, left: 80 }
    const width = containerWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Prepare data for grouped bar chart
    const metrics = ['accuracy', 'fpr', 'fnr']
    const metricLabels = {
      accuracy: 'Accuracy ↑',
      fpr: 'FPR ↓',
      fnr: 'FNR ↓',
    }
    const metricColors = {
      accuracy: '#10b981', // green
      fpr: '#ef4444', // red
      fnr: '#f59e0b', // amber
    }

    // X scale for models
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.model))
      .range([0, width])
      .padding(0.2)

    // X scale for metrics within each model
    const x1 = d3.scaleBand().domain(metrics).range([0, x0.bandwidth()]).padding(0.05)

    // Y scale
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0])

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)

    // Draw bars
    const modelGroups = g
      .selectAll('.model-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'model-group')
      .attr('transform', (d) => `translate(${x0(d.model)},0)`)

    metrics.forEach((metric) => {
      modelGroups
        .append('rect')
        .attr('x', x1(metric)!)
        .attr('y', (d) => y(d[metric as keyof ModelData] as number))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => height - y(d[metric as keyof ModelData] as number))
        .attr('fill', metricColors[metric as keyof typeof metricColors])
        .attr('opacity', 0.8)

      // Add value labels on top of bars
      modelGroups
        .append('text')
        .attr('x', x1(metric)! + x1.bandwidth() / 2)
        .attr('y', (d) => y(d[metric as keyof ModelData] as number) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', '#374151')
        .text((d) => (d[metric as keyof ModelData] as number).toFixed(2))
    })

    // X axis (models)
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('font-size', '12px')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-35)')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')))
      .style('font-size', '12px')

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .text('Score')

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width + margin.left + 20},${margin.top})`)

    metrics.forEach((metric, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0,${i * 25})`)

      legendRow
        .append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', metricColors[metric as keyof typeof metricColors])
        .attr('opacity', 0.8)

      legendRow
        .append('text')
        .attr('x', 24)
        .attr('y', 14)
        .style('font-size', '13px')
        .text(metricLabels[metric as keyof typeof metricLabels])
    })

    // Title
    svg
      .append('text')
      .attr('x', containerWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Model Performance on Ambiguous Queries')
  }, [])

  return (
    <figure className="not-prose my-8">
      <svg ref={svgRef} width="100%" height="450" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        <strong>Figure 2</strong> Comparison of model performance in detecting ambiguity of SWE tasks across accuracy, false
        positive rate (FPR), and false negative rate (FNR) metrics. Higher accuracy is better,
        while lower FPR and FNR are preferred.
      </figcaption>
    </figure>
  )
}

export default ModelComparisonChart
