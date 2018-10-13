import * as d3 from 'd3'
import path from 'path'
import fs from 'fs'
/* eslint-disable */

let symbols
let x
let y

const w = 960
const h = 500

const duration = 1500
const delay = 500

const color = d3.scaleOrdinal(d3.schemeCategory10)

const m = [20, 20, 30, 20]

export default (root) => {
  var svg = d3.select(root).append('svg')
  .attr('class', 'svg-content reel')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 960 500')

  svg.append('g')
      .attr('transform', `translate(${m[3]}, ${m[0]})`)

  // A line generator, for the dark stroke.
  const line = d3.line()
  .curve(d3.curveBasis)
  .x(d => x(d.date))
  .y(d => y(d.price))

// A line generator, for the dark stroke.
const axis = d3.line()
  .curve(d3.curveBasis)
  .x(d => x(d.date))
  .y(h)

// A area generator, for the dark stroke.
const area = d3.area()
  .curve(d3.curveBasis)
  .x(d => x(d.date))
  .y1(d => y(d.price))

fs.readFile(path.join(__static, 'data', 'reel.json'), (err, raw) => {
  if (err) {
    console.error(err)
    return
  }

  const data = JSON.parse(raw)

  const parse = d3.timeParse('%b %Y')

  // Nest stock values by symbol.
  symbols = d3.nest()
    .key(d => d.symbol)
    .entries(data)

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  symbols.forEach(s => {
    s.values.forEach(d => { d.date = parse(d.date); d.price = +d.price; d.price0 = 0 })
    s.maxPrice = d3.max(s.values, d => d.price)
    s.sumPrice = d3.sum(s.values, d => d.price)
  })

  // Sort by maximum price, descending.
  symbols.sort((a, b) => (b.maxPrice - a.maxPrice))

  svg.selectAll('g')
    .data(symbols)
    .enter().append('g')
    .attr('class', 'symbol')

  setTimeout(lines, duration)
})

function lines () {
  x = d3.scaleTime().range([0, w - 60])
  y = d3.scaleLinear().range([h / 4 - 20, 0])

  // Compute the minimum and maximum date across symbols.
  x.domain([
    d3.min(symbols, d => d.values[0].date),
    d3.max(symbols, d => d.values[d.values.length - 1].date)
  ])

  const g = svg.selectAll('.symbol')
    .attr('transform', (d, i) => `translate(0, ${i * h / 4 + 10})`)

  g.each(function (d) {
    const e = d3.select(this)

    e.append('path')
      .attr('class', 'line')

    e.append('circle')
      .attr('r', 5)
      .style('fill', d => color(d.key))
      .style('stroke', '#000')
      .style('stroke-width', '2px')

    e.append('text')
      .attr('x', 12)
      .attr('dy', '.31em')
      .text(d.key)

    function draw (k) {
      g.each(function (d) {
        const e = d3.select(this)
        y.domain([0, d.maxPrice])

        e.select('path')
          .attr('d', d => line(d.values.slice(0, k + 1)))

        e.selectAll('circle, text')
          .data(d => [d.values[k], d.values[k]])
          .attr('transform', d => `translate(${x(d.date)}, ${y(d.price)})`)
      })
    }

    let k = 1
    let n = symbols[0].values.length
    const t = d3.timer(function () {
      draw(k)
      if ((k += 2) >= n - 1) {
        draw(n - 1)
        setTimeout(horizons, 500)
        t.stop()
      }
    })
  })
}

function horizons () {
  svg.insert('defs', '.symbol')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', w)
    .attr('height', h / 4 - 20)

  const color = d3.scaleOrdinal()
    .range(['#c6dbef', '#9ecae1', '#6baed6'])

  const g = svg.selectAll('.symbol')
    .attr('clip-path', 'url(#clip)')

  area
    .y0(h / 4 - 20)

  g.select('circle').transition()
    .duration(duration)
    .attr('transform', d => `translate(${w - 60}, ${-h / 4})`)
    .remove()

  g.select('text').transition()
    .duration(duration)
    .attr('transform', d => `translate(${w - 60}, ${h / 4 - 20})`)
    .attr('dy', '0em')

  g.each(function (d) {
    y.domain([0, d.maxPrice])

    d3.select(this).selectAll('.area')
      .data(d3.range(3))
      .enter().insert('path', '.line')
      .attr('class', 'area')
      .attr('transform', d => `translate(0, ${d * (h / 4 - 20)})`)
      .attr('d', area(d.values))
      .style('fill', (d, i) => color(i))
      .style('fill-opacity', 1e-6)

    y.domain([0, d.maxPrice / 3])

    d3.select(this).selectAll('.line').transition()
      .duration(duration)
      .attr('d', line(d.values))
      .style('stroke-opacity', 1e-6)

    d3.select(this).selectAll('.area').transition()
      .duration(duration)
      .style('fill-opacity', 1)
      .attr('d', area(d.values))
      .on('end', function () { d3.select(this).style('fill-opacity', null) })
  })

  setTimeout(areas, duration + delay)
}

function areas () {
  const g = svg.selectAll('.symbol')

  axis
    .y(h / 4 - 21)

  g.select('.line')
    .attr('d', d => axis(d.values))

  g.each(function (d) {
    y.domain([0, d.maxPrice])

    d3.select(this).select('.line').transition()
      .duration(duration)
      .style('stroke-opacity', 1)
      .on('end', function () { d3.select(this).style('stroke-opacity', null) })

    d3.select(this).selectAll('.area')
      .filter((d, i) => i)
      .transition()
      .duration(duration)
      .style('fill-opacity', 1e-6)
      .attr('d', area(d.values))
      .remove()

    d3.select(this).selectAll('.area')
      .filter((d, i) => !i)
      .transition()
      .duration(duration)
      .style('fill', color(d.key))
      .attr('d', area(d.values))
  })

  svg.select('defs').transition()
    .duration(duration)
    .remove()

  g.transition()
    .duration(duration)
    .on('end', function () { d3.select(this).attr('clip-path', null) })

  setTimeout(stackedArea, duration + delay)
}

function stackedArea () {
  const stack = d3.stack()
    .keys(symbols.map(d => d.key))
    .offset(d3.stackOffsetWiggle)
    // .value((d, key) => { console.log(d); return d[key] })
    // .value(d => d.values)
    // .x(d => d.date)
    // .y(d => d.price)
    // .out((d, y0, y) => { d.price0 = y0 })
    // .order('reverse')

  stack(symbols)

  y
    .domain([0, d3.max(symbols[0].values.map(d => (d.price + d.price0)))])
    .range([h, 0])

  line
    .y(d => y(d.price0))

  area
    .y0(d => y(d.price0))
    .y1(d => y(d.price0 + d.price))

  const t = svg.selectAll('.symbol').transition()
    .duration(duration)
    .attr('transform', 'translate(0, 0)')
    .on('end', function () { d3.select(this).attr('transform', null) })

  t.select('path.area')
    .attr('d', d => area(d.values))

  t.select('path.line')
    .style('stroke-opacity', (d, i) => (i < 3 ? 1e-6 : 1))
    .attr('d', d => line(d.values))

  t.select('text')
    .attr('transform', d => { d = d.values[d.values.length - 1]; return 'translate(' + (w - 60) + ',' + y(d.price / 2 + d.price0) + ')' })

  setTimeout(streamgraph, duration + delay)
}

function streamgraph () {
  const stack = d3.stack()
    .keys(d3.range(symbols))
    .offset(d3.stackOffsetWiggle)
    // .values(function(d) { return d.values; })
    // .x(function(d) { return d.date; })
    // .y(function(d) { return d.price; })
    // .out(function(d, y0, y) { d.price0 = y0; })
    // .order("reverse")
    // .offset("wiggle");

  stack(symbols)

  line
    .y(d => y(d.price0))

  const t = svg.selectAll('.symbol').transition()
    .duration(duration)

  t.select('path.area')
    .attr('d', d => area(d.values))

  t.select('path.line')
    .style('stroke-opacity', 1e-6)
    .attr('d', d => line(d.values))

  t.select('text')
    .attr('transform', d => { d = d.values[d.values.length - 1]; return 'translate(' + (w - 60) + ',' + y(d.price / 2 + d.price0) + ')' })

  setTimeout(overlappingArea, duration + delay)
}

function overlappingArea () {
  const g = svg.selectAll('.symbol')

  line
    .y(d => y(d.price0 + d.price))

  g.select('.line')
    .attr('d', d => line(d.values))

  y
    .domain([0, d3.max(symbols.map(d => d.maxPrice))])
    .range([h, 0])

  area
    .y0(h)
    .y1(d => y(d.price))

  line
    .y(d => y(d.price))

  const t = g.transition()
    .duration(duration)

  t.select('.line')
    .style('stroke-opacity', 1)
    .attr('d', d => line(d.values))

  t.select('.area')
    .style('fill-opacity', 0.5)
    .attr('d', d => area(d.values))

  t.select('text')
    .attr('dy', '.31em')
    .attr('transform', function (d) { d = d.values[d.values.length - 1]; return 'translate(' + (w - 60) + ',' + y(d.price) + ')' })

  svg.append('line')
    .attr('class', 'line')
    .attr('x1', 0)
    .attr('x2', w - 60)
    .attr('y1', h)
    .attr('y2', h)
    .style('stroke-opacity', 1e-6)
    .transition()
    .duration(duration)
    .style('stroke-opacity', 1)

  setTimeout(groupedBar, duration + delay)
}

function groupedBar () {
  x = d3.scaleBand()
    .domain(symbols[0].values.map(d => d.date))
    .range([0, w - 60], 0.1)

  const x1 = d3.scaleBand()
    .domain(symbols.map(d => d.key))
    .range([0, x.bandwidth()])

  const g = svg.selectAll('.symbol')

  const t = g.transition()
    .duration(duration)

  t.select('.line')
    .style('stroke-opacity', 1e-6)
    .remove()

  t.select('.area')
    .style('fill-opacity', 1e-6)
    .remove()

  g.each(function (p, j) {
    d3.select(this).selectAll('rect')
      .data(d => d.values)
      .enter().append('rect')
      .attr('x', d => x(d.date) + x1(p.key))
      .attr('y', d => y(d.price))
      .attr('width', x1.bandwidth())
      .attr('height', d => h - y(d.price))
      .style('fill', color(p.key))
      .style('fill-opacity', 1e-6)
      .transition()
      .duration(duration)
      .style('fill-opacity', 1)
  })

  setTimeout(stackedBar, duration + delay)
}

function stackedBar () {
  x.range([0, w - 60], 0.1)

  const stack = d3.stack()
    .keys(d3.range(symbols))
    .offset(d3.stackOffsetWiggle)
    // .values(function(d) { return d.values; })
    // .x(function(d) { return d.date; })
    // .y(function(d) { return d.price; })
    // .out(function(d, y0, y) { d.price0 = y0; })
    // .order("reverse");

  const g = svg.selectAll('.symbol')

  stack(symbols)

  y
    .domain([0, d3.max(symbols[0].values.map(function (d) { return d.price + d.price0 }))])
    .range([h, 0])

  const t = g.transition()
    .duration(duration / 2)

  t.select('text')
    .delay(symbols[0].values.length * 10)
    .attr('transform', function (d) { d = d.values[d.values.length - 1]; return 'translate(' + (w - 60) + ',' + y(d.price / 2 + d.price0) + ')' })

  t.selectAll('rect')
    .delay(function (d, i) { return i * 10 })
    .attr('y', function (d) { return y(d.price0 + d.price) })
    .attr('height', function (d) { return h - y(d.price) })
    .on('end', function () {
      d3.select(this)
        .style('stroke', '#fff')
        .style('stroke-opacity', 1e-6)
        .transition()
        .duration(duration / 2)
        .attr('x', d => x(d.date))
        .attr('width', x.bandwidth())
        .style('stroke-opacity', 1)
    })

  setTimeout(transposeBar, duration + symbols[0].values.length * 10 + delay)
}

function transposeBar () {
  x
    .domain(symbols.map(d => d.key))
    .range([0, w], 0.2)

  y
    .domain([0, d3.max(symbols.map(d => d3.sum(d.values.map(d => d.price))))])

  const stack = d3.stack()
    .keys(d3.range(symbols))
    .offset(d3.stackOffsetWiggle)
    // .x((d, i) => i)
    // .y(function(d) { return d.price; })
    // .out(function(d, y0, y) { d.price0 = y0; });

  stack(d3.zip.apply(null, symbols.map(d => d.values))) // transpose!

  const g = svg.selectAll('.symbol')

  const t = g.transition()
    .duration(duration / 2)

  t.selectAll('rect')
    .delay(function (d, i) { return i * 10 })
    .attr('y', d => y(d.price0 + d.price) - 1)
    .attr('height', d => h - y(d.price) + 1)
    .attr('x', d => x(d.symbol))
    .attr('width', x.bandwidth())
    .style('stroke-opacity', 1e-6)

  t.select('text')
    .attr('x', 0)
    .attr('transform', function (d) { return 'translate(' + (x(d.key) + x.bandwidth() / 2) + ',' + h + ')' })
    .attr('dy', '1.31em')
    .on('end', function () { d3.select(this).attr('x', null).attr('text-anchor', 'middle') })

  svg.select('line').transition()
    .duration(duration)
    .attr('x2', w)

  setTimeout(donut, duration / 2 + symbols[0].values.length * 10 + delay)
}

function donut () {
  const g = svg.selectAll('.symbol')

  g.selectAll('rect').remove()

  const pie = d3.pie()
    .value(d => d.sumPrice)

  const arc = d3.arc()

  g.append('path')
    .style('fill', d => color(d.key))
    .data(() => pie(symbols))
    .transition()
    .duration(duration)
    .tween('arc', arcTween)

  g.select('text').transition()
    .duration(duration)
    .attr('dy', '.31em')

  svg.select('line').transition()
    .duration(duration)
    .attr('y1', 2 * h)
    .attr('y2', 2 * h)
    .remove()

  function arcTween (d) {
    let path = d3.select(this)
    let text = d3.select(this.parentNode.appendChild(this.previousSibling))
    let x0 = x(d.data.key)
    let y0 = h - y(d.data.sumPrice)

    return function (t) {
      let r = h / 2 / Math.min(1, t + 1e-3)
      let a = Math.cos(t * Math.PI / 2)
      let xx = (-r + (a) * (x0 + x.bandwidth()) + (1 - a) * (w + h) / 2)
      let yy = ((a) * h + (1 - a) * h / 2)
      let f = {
        innerRadius: r - x.bandwidth() / (2 - a),
        outerRadius: r,
        startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
        endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
      }

      path.attr('transform', 'translate(' + xx + ',' + yy + ')')
      path.attr('d', arc(f))
      text.attr('transform', 'translate(' + arc.centroid(f) + ')translate(' + xx + ',' + yy + ')rotate(' + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ')')
    }
  }

  setTimeout(donutExplode, duration + delay)
}

function donutExplode () {
  let r0a = h / 2 - x.bandwidth() / 2
  let r1a = h / 2
  let r0b = 2 * h - x.bandwidth() / 2
  let r1b = 2 * h
  let arc = d3.arc()

  svg.selectAll('.symbol path')
    .each(transitionExplode)

  function transitionExplode (d, i) {
    d.innerRadius = r0a
    d.outerRadius = r1a
    d3.select(this).transition()
      .duration(duration / 2)
      .tween('arc', tweenArc({
        innerRadius: r0b,
        outerRadius: r1b
      }))
  }

  function tweenArc (b) {
    return function (a) {
      let path = d3.select(this)
      let text = d3.select(this.nextSibling)
      let i = d3.interpolate(a, b)
      for (var key in b) a[key] = b[key] // update data
      return function (t) {
        var a = i(t)
        path.attr('d', arc(a))
        console.log(a, arc.centroid(a))
        text.attr('transform', `translate(${arc.centroid(a)})translate(${w / 2}, ${h / 2})rotate(${((a.startAngle + a.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI})`)
      }
    }
  }

  /*
  setTimeout(function() {
    svg.selectAll('*').remove()
    svg.selectAll('g').data(symbols).enter().append('g').attr('class', 'symbol')
    lines()
  }, duration)
  */
}
}
