'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface TreeNode {
  name: string
  cite?: string
  usedBy?: string
  children?: TreeNode[]
}

const treeData: TreeNode = {
  name: 'RL for LLMs',
  children: [
    {
      name: 'Online Policy Gradient',
      children: [
        {
          name: 'REINFORCE',
          cite: 'Williams 1992',
          children: [
            { name: 'REINFORCE++', cite: 'Hu et al. 2025' },
            { name: 'RLOO', cite: 'Ahmadian et al. 2024' },
            { name: 'ReMax', cite: 'Li et al. 2024' },
          ],
        },
        {
          name: 'PPO',
          cite: 'Schulman et al. 2017',
          children: [
            { name: 'VinePPO', cite: 'Kazemnejad et al. 2024' },
          ],
        },
        {
          name: 'GRPO',
          cite: 'Shao et al. 2024',
          usedBy: 'DeepSeek-R1',
          children: [
            { name: 'DAPO', cite: 'Yu et al. 2025', usedBy: 'ByteDance' },
            { name: 'Dr. GRPO', cite: 'Liu et al. 2025' },
            { name: 'GPG', cite: 'Chu et al. 2025' },
            { name: 'GSPO', cite: 'Zheng et al. 2025', usedBy: 'Qwen3' },
            { name: 'CISPO', cite: 'MiniMax 2025', usedBy: 'MiniMax-M1' },
          ],
        },
      ],
    },
    {
      name: 'Preference Optimization',
      children: [
        {
          name: 'DPO',
          cite: 'Rafailov et al. 2023',
          usedBy: 'Llama 2/3',
          children: [
            { name: 'SimPO', cite: 'Meng et al. 2024' },
            { name: 'KTO', cite: 'Ethayarajh et al. 2024' },
            { name: 'ORPO', cite: 'Hong et al. 2024' },
            { name: 'IPO', cite: 'Azar et al. 2024' },
            { name: 'Online DPO', cite: 'Various 2024' },
          ],
        },
      ],
    },
    {
      name: 'Self-Training',
      children: [
        { name: 'STaR', cite: 'Zelikman et al. 2022' },
        { name: 'ReST', cite: 'Gulcehre et al. 2023' },
        { name: 'RAFT', cite: 'Dong et al. 2023' },
      ],
    },
  ],
}

const familyColors: Record<string, string> = {
  'Online Policy Gradient': '#3b82f6',
  'Preference Optimization': '#10b981',
  'Self-Training': '#f59e0b',
}

function getColor(node: d3.HierarchyNode<TreeNode>): string {
  if (node.depth === 0) return '#64748b'
  let current: d3.HierarchyNode<TreeNode> = node
  while (current.depth > 1 && current.parent) current = current.parent
  return familyColors[current.data.name] || '#64748b'
}

export default function AlgorithmTreeChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''

    const W = ref.current.clientWidth || 700
    const margin = { top: 24, right: 210, bottom: 24, left: 90 }
    const innerW = W - margin.left - margin.right

    const root = d3.hierarchy(treeData)
    const numLeaves = root.leaves().length
    const rowH = 34
    const H = numLeaves * rowH + margin.top + margin.bottom
    const innerH = H - margin.top - margin.bottom

    const layout = d3.tree<TreeNode>().size([innerH, innerW])
    layout(root as d3.HierarchyNode<TreeNode>)

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', W)
      .attr('height', H)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // ── links ─────────────────────────────────────────────────────────
    root.links().forEach((link) => {
      const s = link.source as d3.HierarchyPointNode<TreeNode>
      const t = link.target as d3.HierarchyPointNode<TreeNode>
      const midY = (s.y + t.y) / 2
      g.append('path')
        .attr(
          'd',
          `M${s.y},${s.x} C${midY},${s.x} ${midY},${t.x} ${t.y},${t.x}`
        )
        .attr('fill', 'none')
        .attr('stroke', getColor(link.target))
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.3)
    })

    // ── nodes ─────────────────────────────────────────────────────────
    root.descendants().forEach((node) => {
      const n = node as d3.HierarchyPointNode<TreeNode>
      const col = getColor(node)
      const isLeaf = !node.children
      const isRoot = node.depth === 0
      const isFamily = node.depth === 1

      // circle
      g.append('circle')
        .attr('cx', n.y)
        .attr('cy', n.x)
        .attr('r', isRoot ? 6 : isFamily ? 5 : isLeaf ? 3.5 : 4.5)
        .attr('fill', col)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)

      // ── label positioning ───────────────────────────────────────────
      const toRight = isLeaf
      const labelX = toRight ? n.y + 10 : n.y - 10
      const anchor = toRight ? 'start' : 'end'

      // name (+ inline cite for depth >= 2)
      let displayName = node.data.name
      if (node.data.cite && node.depth >= 2) {
        displayName += `  (${node.data.cite})`
      }

      g.append('text')
        .attr('x', labelX)
        .attr('y', n.x)
        .attr('dy', '0.35em')
        .attr('text-anchor', anchor)
        .style('font-size', isRoot || isFamily ? '12px' : '11px')
        .style('font-weight', isRoot || isFamily ? '700' : '500')
        .style('fill', '#374151')
        .text(displayName)

      // "used by" tag — inline after the name, on the next line
      if (node.data.usedBy) {
        g.append('text')
          .attr('x', labelX)
          .attr('y', n.x + 14)
          .attr('dy', '0.35em')
          .attr('text-anchor', anchor)
          .style('font-size', '9px')
          .style('fill', col)
          .style('font-weight', '600')
          .text(`\u2192 ${node.data.usedBy}`)
      }
    })

    // ── legend ────────────────────────────────────────────────────────
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${H - 8})`)

    const families = Object.entries(familyColors)
    families.forEach(([name, color], i) => {
      const xOff = i * 180
      legend
        .append('circle')
        .attr('cx', xOff)
        .attr('cy', 0)
        .attr('r', 4)
        .attr('fill', color)
      legend
        .append('text')
        .attr('x', xOff + 8)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('fill', '#6b7280')
        .text(name)
    })
  }, [])

  return (
    <figure className="not-prose my-8">
      <div ref={ref} className="w-full" />
      <figcaption className="mt-3 text-center text-sm text-zinc-500">
        <strong>Figure 3:</strong> A taxonomy of RL algorithms used for LLM
        post-training: online policy gradient methods (blue), preference
        optimization (green), and self-training (amber). The post walks
        through all three branches and ties them back to SFT.
      </figcaption>
    </figure>
  )
}
