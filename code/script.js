const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 100
const svg = d3.select('#chart')
const color1 = '#87CEFA'
const color2 = '#90EE90'
const textColor = '#194d30'
const pieRadius = 20

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}

// when you need to make the slice of the pie chart : 
// describeArc(pieRadius/2, pieRadius/2, pieRadius, 0, (360*percentage))

const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

console.log(data)

/*END*/

//start

const xScale=d3.scaleLinear()
	.domain([0,data.lenght])
	.range([padding,width-padding])


const yScale=d3.scaleLinear()
	.domain([0,d3.max(data, d => d.evasion)])
	.range([height-padding,padding])

const yAxis=d3.axisLeft(yScale)
	.ticks(9)
	.tickSize(-(height-(padding*2)))

const yTicks = svg
	.append('g')
	.attr('transform', `translate(${padding}, 0)`)
	.call(yAxis)

// colouring the ticks
svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')

// colouring the ticks' text
svg
	.selectAll('.tick text')
	.style('color', textColor)

// hiding the vertical ticks' line
svg
	.selectAll('path.domain')
	.style('stroke-width', 0)


const arc = describeArc(300, 300, 100, 20, 100)
	
const pies = svg
	.selectAll('g')
	.data(data)
	.enter()
	.append('g')

// const circle = pies
// 	.append('circle')
// 	.attr('cx',(d, i) => padding + xScale(i))
// 	.attr('cy',d => yScale(d.evasion))
// 	.attr('r',10)
// 	.attr('fill','orange')

const circle = pies
	.append('circle')
	.attr('cx',300)
	.attr('cy',300)
	.attr('r',100)
	.attr('fill','orange')

const arcs = pies
	.append('path')
	.attr('d',arc)
		// .attr('x', (describeArc(data[0].companyType,data[0].evasion, 3, 0, data[0].percControlled), i) => barPadding + xScale(i))

