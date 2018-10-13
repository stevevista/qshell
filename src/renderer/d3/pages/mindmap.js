import * as d3 from 'd3'
/* eslint-disable */
import path from 'path'
import fs from 'fs'

class MinMap2 {
  constructor (svg, size) {
    this.svg = svg
    this.size = size
  }

  render () {
    fs.readFile(path.join(__static, 'data', 'qsprmind.json'), (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const graph = JSON.parse(data)

      this.create(graph)
      this.animate([0, 0])
    })
  }

  create (data) {
    const [width, height] = this.size
    this.tree = d3.tree()
      .size([360, 120])
      .separation((t, e) => (t.parent === e.parent ? 1 : 2) / t.depth)
    this.root = d3.hierarchy(data)
    this.root.descendants().forEach((t, e) => {
      this.toggle(t)
    })
    let gmind = this.svg.select('.gmind')
    gmind.empty() && (gmind = this.svg.append('g').attr('class', 'gmind'))
    this.links = gmind.select('.glink')
    this.links.empty() && (this.links = gmind.append('g').attr('class', 'glink'))
    this.gondes = gmind.select('.gnode')
    this.gondes.empty() && (this.gondes = gmind.append('g').attr('class', 'gnode'))
    const initLocation = `translate(${width / 3}, ${height / 3})`
    this.links.attr('transform', initLocation)
    this.gondes.attr('transform', initLocation)
    let t = d3.zoom()
      .scaleExtent([0.7, 2])
      .translateExtent([[-0.7 * width, -0.7 * height], [1.7 * width, 1.7 * height]])
      .on('zoom', () => {
        gmind.attr('transform', `translate(${d3.event.transform.x},${d3.event.transform.y}) scale(${d3.event.transform.k})`)
      })
    this.svg.call(t)
  }

  animate (pos) {
    const [x, y] = pos
    let b = 0
    let M = 0
    this.tree(this.root)
    const children = this.root.descendants()
    const links = this.root.links()
    children.forEach(t => {
      t.y = 120 * t.depth
      t.pos = this.calPos(t.x, t.y)
      t.id = b++
    })
    links.forEach(t => {
      t.id = M++
    })
    const xAxis = d3.scaleLinear().domain([0, 180, 360]).range([1, 0.3, 1])
    const dAxis = d3.scaleLinear().domain([0, 1, 5, 10]).range([13, 13, 6.5, 6.5])
    const subnodes = this.gondes.selectAll('.node').data(children, t => t.id)
    const nodes = subnodes.exit()
    const g = subnodes.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', e => `translate(${x}, ${y})`)
      .on('mousedown', t => {
        if (!d3.event.defaultPrevented) {
          this.toggle(t)
          this.animate(t.prevPos)
        }
      })
      .on('mouseover', function (t) { d3.select(this).style('cursor', 'pointer') })

    g.append('circle')
      .attr('r', 0)
      .style('fill', function (t) {
        let e = ''
        if (t.depth > 1) {
          e = d3.hsl(t.parent.color)
          e = e.brighter(0.5)
          e.l = xAxis(t.x)
        } else {
          e = t.depth > 0 ? d3.hsl(t.x, 1, 0.5) : '#FFFFFF'
        }
        t.color = e
        return t.color
      })
      .style('stroke-width', 2)
      .style('stroke', 'black')
      .style('opacity', 0)

    g.append('text')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      //.attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('dy', 13)
      .text(t => {
        return t.data.name
      })
      .style('fill-opacity', 1)

    var p = g.merge(subnodes)
      .transition()
      .duration(600)
      .attr('transform', t => 'translate(' + t.pos[0] + ',' + t.pos[1] + ')')

    p.select('circle')
      .attr('r', t => dAxis(t.depth))
      .style('opacity', 1)
    p.select('text')
      .attr('dy', t => dAxis(t.depth))
      .style('fill-opacity', 1)

    var m = nodes.transition()
      .duration(600)
      .attr('transform', e => `translate(${x}, ${y})`)
      .remove()

    m.select('circle')
      .style('opacity', 0)
      .attr('r', 0)
    m.select('text')
      .style('fill-opacity', 0)

    var w = this.links.selectAll('.link')
      .data(links, t => t.target.id)

    w.enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,20,0.8)')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .attr('d', (e) => {
        const r = { x, y }
        return this.s({ source: r, target: r })
      })
      .merge(w)
      .transition()
      .duration(600)
      .attr('opacity', 1)
      .attr('d', t => {
        const e = { x: t.source.pos[0], y: t.source.pos[1] }
        const r = { x: t.target.pos[0], y: t.target.pos[1] }
        return `M${e.x},${e.y}L${r.x},${r.y}`
      })
    w.exit().transition()
      .duration(600)
      .attr('opacity', 0)
      .attr('d', e => `M${x},${y}L${x},${y}`)
      .remove()

    children.forEach(t => { t.prevPos = t.pos })
  }

  toggle (t) {
    if (t.children) {
      t._children = t.children
      t.children = null
      t.data.closed = true
    } else {
      t.children = t._children
      t._children = null
      t.data.closed = false
    }
  }

  calPos (t, e) {
    const r = (t - 90) / 180 * Math.PI
    return [e * Math.cos(r), e * Math.sin(r)]
  }

  s (t) {
    return 'M' + t.source.x + ',' + t.source.y + 'C' + (t.source.x + t.target.x) / 2 + ',' + t.source.y + ' ' + (t.source.x + t.target.x) / 2 + ',' + t.target.y + ' ' + t.target.x + ',' + t.target.y
  }
}

const width = 1000
const height = 1000

export default (root) => {
  var svg = d3.select(root).append('svg')
  .attr('class', 'svg-content editor')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 1000 1000')

  let map = new MinMap2(svg, [width, height])
  map.render()
}

