import * as d3 from 'd3'
import path from 'path'
import fs from 'fs'
/* eslint-disable */

let simulation

const width = 800
const height = 800

function dragstarted (d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged (d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended (d) {
  if (!d3.event.active) simulation.alphaTarget(0)
  d.fx = null
  d.fy = null
}

export default (container) => {
  var svg = d3.select(container).append('svg')
  .attr('class', 'svg-content')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 800 800')

  const color = d3.scaleOrdinal(d3.schemeCategory10)

    simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    fs.readFile(path.join(__static, 'data', 'miserables.json'), (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const graph = JSON.parse(data)

      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter().append('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', d => color(d.group))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))

      node.append('title')
        .text(d => d.id)

      simulation
        .nodes(graph.nodes)
        .on('tick', ticked)

      simulation.force('link')
        .links(graph.links)

      function ticked () {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      }
    })
}
