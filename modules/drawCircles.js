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

    // Select svg
    const svg = d3.selectAll('svg')
        .attr('viewBox', [0, 0, width, height])
        .call(d3.zoom().scaleExtent([1 / 8, 24]).on('zoom', onzoom))
        .append('g')
        .attr('class', 'circle__container');

    // Create parent element for the circles and text
    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`);

    // Create bubbles
    leaf.append('circle')
        .attr('r', d => d.r)
    // Assign colors
        .attr('fill', d => color(d.data.upperCategory));
    
    // Create text
    leaf.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'white')
    // Make text invisible when the amount of the category is lower than 500
        .attr('display', d => {return d.data.categoryAmount <= 500 ? 'none' : 'flex';})
        .text(d => d.data.categoryName);

    // Add hover effect with data
    leaf.append('title')
        .text(d => `${d.data.categoryName}\n${format(d.data.categoryAmount)}\nCategorie: ${d.data.upperCategory}`);

    // Zoom function
    function onzoom() {
        svg.attr('transform', d3.event.transform);
    }

    // Get unique upperCategories
    function uniqueUpperCategories(data) {
        let arr = [];
        for (let key in data) {
            arr.push(data[key].upperCategory);
        }
        // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
        let uniqueArray = arr.filter(function(item, pos) {
            return arr.indexOf(item) == pos;
        });
        return uniqueArray;
    };

    // Save array in a const
    const legendData = uniqueUpperCategories(data);

    // Add legend
    const legendContainer = d3.selectAll('svg')
        .append('g')
        .attr('class', 'legend__container');

    const legend = legendContainer.selectAll('legend__container')
        .data(legendData)
        .enter()
        .append('g');

    legend.append('text')
        .attr('fill', d => {return color(d);})
        .attr('y', function(d, i){return 32+28*i;})
        .attr('x', 150)
        .text(d => {return d;});
        
    return svg.node();
}