'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ChartData {
  category: string
  baseline: number
  withRL: number
  improvement: number
}

const VaguePromptChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const data: ChartData[] = [
      {
        category: 'Precise Prompt\n(No Interaction)',
        baseline: 58.5,
        withRL: 64.2,
        improvement: 5.7
      },
      {
        category: 'Vague Prompt\n(No Interaction)',
        baseline: 36.5,
        withRL: 44.02,
        improvement: 7.52
      },
      {
        category: 'Vague Prompt\n(With Interaction)',
        baseline: 36.0,
        withRL: 57.66,
        improvement: 21.66
      },
    ]

    const margin = { top: 60, right: 20, bottom: 80, left: 60 }
    const width = 700 - margin.left - margin.right
    const height = 450 - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 700 450`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const x0 = d3
      .scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.2)

    const x1 = d3
      .scaleBand()
      .domain(['baseline', 'withRL'])
      .range([0, x0.bandwidth()])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, 75])
      .range([height, 0])

    // Color scheme matching the image
    const colors = {
      precise: { baseline: '#90EE90', withRL: '#4CAF50' },
      vagueNoInt: { baseline: '#ADD8E6', withRL: '#4169E1' },
      vagueWithInt: { baseline: '#FFD580', withRL: '#FF8C00' }
    }

    const getColors = (category: string) => {
      if (category.includes('Precise')) return colors.precise
      if (category.includes('With Interaction')) return colors.vagueWithInt
      return colors.vagueNoInt
    }

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
      .call(g => g.select('.domain').remove())

    gridGroup
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.7)

    // Move grid lines behind bars
    svg.select('.grid').lower()

    // Draw bars for each category
    data.forEach((d) => {
      const categoryX = x0(d.category)!
      const categoryColors = getColors(d.category)

      // Baseline bar
      svg
        .append('rect')
        .attr('x', categoryX + x1('baseline')!)
        .attr('y', y(d.baseline))
        .attr('width', x1.bandwidth())
        .attr('height', height - y(d.baseline))
        .attr('fill', categoryColors.baseline)
        .attr('rx', 3)

      // WithRL bar
      svg
        .append('rect')
        .attr('x', categoryX + x1('withRL')!)
        .attr('y', y(d.withRL))
        .attr('width', x1.bandwidth())
        .attr('height', height - y(d.withRL))
        .attr('fill', categoryColors.withRL)
        .attr('rx', 3)

      // Add improvement label above bars
      svg
        .append('text')
        .attr('x', categoryX + x0.bandwidth() / 2)
        .attr('y', y(d.withRL) - 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .style('fill', '#111')
        .text(`+${d.improvement.toFixed(2)}`)

      // Add "+RL" label on the bar
      svg
        .append('text')
        .attr('x', categoryX + x1('withRL')! + x1.bandwidth() / 2)
        .attr('y', y(d.withRL) + 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text('+RL')
    })

    // Add x-axis
    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))

    xAxis.selectAll('.tick text')
      .remove()

    // Add custom x-axis labels with line breaks
    data.forEach((d) => {
      const lines = d.category.split('\n')
      const x = x0(d.category)! + x0.bandwidth() / 2

      lines.forEach((line, i) => {
        svg
          .append('text')
          .attr('x', x)
          .attr('y', height + 15 + i * 18)
          .attr('text-anchor', 'middle')
          .style('font-size', '13px')
          .style('fill', '#111')
          .text(line)
      })
    })

    // Add y-axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(8))
      .selectAll('text')
      .style('font-size', '13px')
      .style('fill', '#111')

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#111')
      .text('F1 Score · SWE-Func-Loc')

  }, [])

  return (
    <figure className="not-prose my-8">
      <svg ref={svgRef} width="100%" className="overflow-visible" />
      <figcaption className="text-center mt-3 text-sm text-zinc-600">
        <strong>Figure 6:</strong> F1 score on <em>SWE-Bench-Verified (SWE-Func-Loc)</em>, comparing precise vs. vague initial user prompts
        and agents with vs. without user interaction.
      </figcaption>
    </figure>
  )
}

export default VaguePromptChart
