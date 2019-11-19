// I used this example for my following code: https://observablehq.com/@d3/bubble-chart
export default function drawCircles(data) {
    // Set standards
    const width = '1400';
    const height = '700';
    const format = d3.format(',d');
    // Give each different category their own color
    const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10);
    
    const pack = data => d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
        (d3.hierarchy({children: data})
            .sum(d => d.categoryAmount));

    const root = pack(data);

    function onHover() {
        d3.select(this).attr('class', 'startHover')
    }

    function onLeave() {
        d3.select(this).attr('class', 'leaveHover')
    }

    // Select svg
    const svg = d3.selectAll('svg')
        .attr('viewBox', [0, 0, width, height])
        .call(d3.zoom().scaleExtent([1 / 8, 24]).on('zoom', onzoom))
        .append('g')

    // Create parent element for the circles and text
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)
    // Create bubbles
    leaf.append('circle')
        .attr('r', d => d.r)
        .on('mouseenter', onHover)
        .on('mouseout', onLeave)
    // Assign colors
        .attr('fill', d => color(d.data.upperCategory));
    leaf.append('text')
        .attr('x', 0)
        .attr('y', 0)
    // Make text invisible when the amount of the category is lower than 500
        .attr('display', d => {return d.data.categoryAmount <= 500 ? 'none' : 'flex';})
        .text(d => d.data.categoryName);
    // Add hover effect with data
    leaf.append('title')
        .text(d => `${d.data.categoryName}\n${format(d.data.categoryAmount)}\nCategorie: ${d.data.upperCategory}`);

    function onzoom() {
        svg.attr('transform', d3.event.transform);
    }
        
    return svg.node();
}