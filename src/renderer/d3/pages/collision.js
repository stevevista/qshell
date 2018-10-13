import * as d3 from 'd3'
/* eslint-disable */

const width = 1080
const height = 800

const nodes = d3.range(200).map(() => ({radius: Math.random() * 12 + 4}))
const color = d3.scaleOrdinal(d3.schemeCategory10)

const root = nodes[0]
root.radius = 0
root.fixed = true

export default (container) => {
  var svg = d3.select(container).append('svg')
  .attr('class', 'svg-content editor')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 1080 800')

  const forceX = d3.forceX(width / 2).strength(0.015)
    const forceY = d3.forceY(height / 2).strength(0.015)

    svg.selectAll('circle')
      .data(nodes.slice(1))
      .enter()
      .append('svg:circle')
      .attr('r', d => (d.radius - 2))
      .style('fill', (d, i) => color(i % 3))

    const ticked = (e) => {
      svg.selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }

    const simulation = d3.forceSimulation()
      // .force('charge', d3.forceManyBody().strength((d, i) => (i ? 0 : -1000)))
      .velocityDecay(0.2)
      .force('x', forceX)
      .force('y', forceY)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d, i) => {
        if (i === 0) {
          return Math.random() * 50 + 100
        }
        return d.radius + 0.5
      }).iterations(5))
      .nodes(nodes)
      .on('tick', ticked)

    svg.on('mousemove', function () {
      var p1 = d3.mouse(this)
      root.fx = p1[0]
      root.fy = p1[1]
      simulation.alphaTarget(0.3).restart()
    })
}
