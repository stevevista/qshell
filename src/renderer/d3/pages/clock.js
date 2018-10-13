import * as d3 from 'd3'
/* eslint-disable */

const width = 700
const height = 700


export default (container) => {
  var svg = d3.select(container).append('svg')
  .attr('class', 'svg-content editor')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 960 960')

  const radius = Math.min(width, height) / 1.9
    const armRadius = radius / 22
    const dotRadius = armRadius - 6

    const duration = 750

    const pi = Math.PI
    const tau = pi * 2

    const fields = [
      {radius: 0.2 * radius, interval: d3.timeYear, subinterval: d3.timeMonth, format: d3.timeFormat('%b')},
      {radius: 0.3 * radius, interval: d3.timeMonth, subinterval: d3.timeDay, format: d3.timeFormat('%d')},
      {radius: 0.4 * radius, interval: d3.timeWeek, subinterval: d3.timeDay, format: d3.timeFormat('%a')},
      {radius: 0.6 * radius, interval: d3.timeDay, subinterval: d3.timeHour, format: d3.timeFormat('%H')},
      {radius: 0.7 * radius, interval: d3.timeHour, subinterval: d3.timeMinute, format: d3.timeFormat('%M')},
      {radius: 0.8 * radius, interval: d3.timeMinute, subinterval: d3.timeSecond, format: d3.timeFormat('%S')}
    ]

    const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain([0, tau])

    const arcArm = d3.arc()
      .startAngle(d => armRadius / d.radius)
      .endAngle(d => -pi - armRadius / d.radius)
      .innerRadius(d => d.radius - armRadius)
      .outerRadius(d => d.radius + armRadius)
      .cornerRadius(armRadius)

    const field = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .selectAll('.field')
      .data(fields)
      .enter().append('g')
      .attr('class', 'field')

    field.append('circle')
      .attr('class', 'field-track')
      .attr('r', d => d.radius)

    const fieldTick = field.selectAll('.field-tick')
      .data(d => {
        var date = d.interval(new Date(2000, 0, 1))
        d.range = d.subinterval.range(date, d.interval.offset(date, 1))
        return d.range.map(t => ({time: t, field: d}))
      })
      .enter().append('g')
      .attr('class', 'field-tick')
      .attr('transform', (d, i) => {
        var angle = i / d.field.range.length * tau - pi / 2
        return 'translate(' + Math.cos(angle) * d.field.radius + ',' + Math.sin(angle) * d.field.radius + ')'
      })

    fieldTick.append('circle')
      .attr('r', dotRadius - 3)
      .style('fill', (d, i) => color(i / d.field.range.length * tau))

    fieldTick.append('text')
      .attr('dy', '0.35em')
      .text(d => d.field.format(d.time).slice(0, 2))

    const fieldArm = field.append('path')
      .attr('class', 'field-arm')
      .attr('transform', 'rotate(0)')
      .attr('d', d => {
        return arcArm(d) +
          'M0,' + (dotRadius - d.radius) +
          'a' + dotRadius + ',' + dotRadius + ' 0 0,1 0,' + -dotRadius * 2 +
          'a' + dotRadius + ',' + dotRadius + ' 0 0,1 0,' + dotRadius * 2
      })

    function tick () {
      const now = new Date()
      let then = new Date(+now + duration)
      let next = d3.timeSecond.offset(d3.timeSecond(then), 1)
      let delay = next - duration - now

      // Skip ahead a second if there’s not time for this transition.
      if (delay < duration) {
        delay += 1000
        then = next
      }

      fieldArm.transition()
        .duration(duration)
        .each(d => {
          var start = d.interval(then)
          d.activeLength = d.subinterval.count(start, d.interval.offset(start, 1))
          d.activeIndex = d.subinterval.count(start, then)
          d.angle = d.activeIndex / d.range.length * tau
        })
        .attr('transform', d => 'rotate(' + d.angle / pi * 180 + ')')
        .style('fill', d => color(d.angle))

      fieldTick
        .classed('field-tick--disabled', (d, i) => i >= d.field.activeLength)
        .classed('field-tick--active', (d, i) => i === d.field.activeIndex)

      setTimeout(tick, delay)
    }

    tick()
}
