'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface ModelData {
  model: string
  productivity: number
  proactivity: number
  personalization: number
  color: string
}

const PPPComparisonRadar = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(['GPT-5', 'Seed-OSS-36B-Inst', 'PPP (Ours)'])
  )

  const allModels = [
    { id: 'GPT-5', label: 'GPT-5', color: '#9CA3AF' },
    { id: 'Seed-OSS-36B-Inst', label: 'Seed-OSS-36B-Inst', color: '#60A5FA' },
    { id: 'PPP (Ours)', label: 'PPP (Ours)', color: '#10B981' },
    { id: 'w/o Proact.', label: 'w/o Proact.', color: '#F59E0B' },
    { id: 'w/o Pers.', label: 'w/o Pers.', color: '#EF4444' },
    { id: 'w/o Proact. & Pers.', label: 'w/o Proact. & Pers.', color: '#8B5CF6' }
  ]

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(modelId)) {
        newSet.delete(modelId)
      } else {
        newSet.add(modelId)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Data for both benchmarks
    const sweData: ModelData[] = [
      { model: 'GPT-5', productivity: 55.83, proactivity: 36.60, personalization: 12.96, color: '#9CA3AF' },
      { model: 'Seed-OSS-36B-Inst', productivity: 38.59, proactivity: 43.70, personalization: 69.07, color: '#60A5FA' },
      { model: 'PPP (Ours)', productivity: 56.26, proactivity: 75.55, personalization: 89.26, color: '#10B981' },
      { model: 'w/o Proact.', productivity: 53.35, proactivity: 37.75, personalization: 94.21, color: '#F59E0B' },
      { model: 'w/o Pers.', productivity: 55.48, proactivity: 87.15, personalization: 47.25, color: '#EF4444' },
      { model: 'w/o Proact. & Pers.', productivity: 56.77, proactivity: 42.45, personalization: 57.43, color: '#8B5CF6' }
    ]


    // Filter data based on selected models
    const filteredSweData = sweData.filter(d => selectedModels.has(d.model))

    const margin = { top: 30, right: 40, bottom: 0, left: 40 }
    const chartSize = 320
    const totalWidth = chartSize + margin.left + margin.right
    const totalHeight = chartSize + margin.top + margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .append('g')

    // Function to create radar chart
    const createRadarChart = (
      data: ModelData[],
      xOffset: number,
      title: string,
      maxValue: number
    ) => {
      const g = svg.append('g').attr('transform', `translate(${xOffset + margin.left + chartSize / 2},${margin.top + chartSize / 2})`)

      const axes = ['Productivity', 'Proactivity', 'Personalization']
      const angleSlice = (Math.PI * 2) / axes.length
      const radius = chartSize / 2 - 40

      // Scale for radius
      const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius])

      // Draw circular gridlines
      const levels = 5
      for (let i = 1; i <= levels; i++) {
        const levelRadius = (radius * i) / levels
        const levelValue = (maxValue * i) / levels

        g.append('circle')
          .attr('r', levelRadius)
          .attr('fill', 'none')
          .attr('stroke', '#e5e7eb')
          .attr('stroke-width', 1)

        // Add labels for grid levels
        g.append('text')
          .attr('x', 5)
          .attr('y', -levelRadius)
          .attr('dy', '0.4em')
          .style('font-size', '10px')
          .style('fill', '#6b7280')
          .text(levelValue.toFixed(0))
      }

      // Draw axes
      axes.forEach((axis, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        // Axis line
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', '#d1d5db')
          .attr('stroke-width', 1)

        // Axis label
        const labelDistance = radius + 25
        const labelX = Math.cos(angle) * labelDistance
        const labelY = Math.sin(angle) * labelDistance

        g.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('font-size', '12px')
          .style('font-weight', '500')
          .text(axis)
      })

      // Draw data for each model
      data.forEach((model) => {
        const values = [model.productivity, model.proactivity, model.personalization]

        const points = values.map((value, i) => {
          const angle = angleSlice * i - Math.PI / 2
          const r = rScale(value)
          return {
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r
          }
        })

        // Close the path by adding the first point at the end
        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

        // Draw filled area
        g.append('path')
          .attr('d', pathData)
          .attr('fill', model.color)
          .attr('fill-opacity', 0.15)
          .attr('stroke', model.color)
          .attr('stroke-width', 2.5)
          .attr('stroke-opacity', 0.8)

        // Draw points
        points.forEach((point) => {
          g.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', 4)
            .attr('fill', model.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
        })
      })

      // Add title
      // g.append('text')
      //   .attr('x', 0)
      //   .attr('y', -chartSize / 2 - 20)
      //   .attr('text-anchor', 'middle')
      //   .style('font-size', '14px')
      //   .style('font-weight', '600')
      //   .text(title)
    }

    // Create single chart
    createRadarChart(filteredSweData, 0, 'SWE-Bench-Verified (Func-Loc)', 100)

  }, [selectedModels])

  return (
    <figure className="not-prose my-8">
      {/* Model selection controls */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {allModels.map(model => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border-2 ${
              selectedModels.has(model.id)
                ? 'opacity-100 shadow-sm'
                : 'opacity-40 hover:opacity-60'
            }`}
            style={{
              borderColor: model.color,
              backgroundColor: selectedModels.has(model.id) ? `${model.color}20` : 'transparent',
              color: selectedModels.has(model.id) ? model.color : '#6b7280'
            }}
          >
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: model.color }}></span>
            {model.label}
          </button>
        ))}
      </div>

      <svg ref={svgRef} width="100%" className="overflow-visible" />

      <figcaption className="text-center -mt-8 text-sm text-zinc-600">
        <strong>Figure 7:</strong> Interactive radar chart comparing model performance across three dimensions (Productivity,
        Proactivity, Personalization) on SWE-Bench-Verified. Click model names above to toggle their visibility.
        PPP (Ours) shows balanced high performance across all three dimensions, while ablations reveal the importance
        of each reward component.
      </figcaption>
    </figure>
  )
}

export default PPPComparisonRadar
