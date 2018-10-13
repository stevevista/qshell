import * as d3 from 'd3'
/* eslint-disable */

function particle (context, canvas) {
  var m = d3.mouse(canvas)

  context.svg.insert('circle', 'rect')
    .attr('class', 'particle')
    .attr('cx', m[0])
    .attr('cy', m[1])
    .attr('r', 1e-6)
    .style('stroke', d3.hsl((context.i = (context.i + 1) % 360), 1, 0.5))
    .style('stroke-opacity', 1)
    .transition()
    .duration(2000)
    .ease(Math.sqrt)
    .attr('r', 100)
    .style('stroke-opacity', 1e-6)
    .remove()

  d3.event.preventDefault()
}

export default (root) => {
  var svg = d3.select(root).append('svg')
  .attr('class', 'svg-content editor')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 800 800')

  const context = {
    i: 0,
    svg
  }

  svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .on('ontouchstart' in document ? 'touchmove' : 'mousemove', function () { particle(context, this) })
}
