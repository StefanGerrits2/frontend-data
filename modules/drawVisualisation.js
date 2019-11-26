export default function drawVisualisation(data) {
    // Tutorial I followed for my update pattern: https://www.youtube.com/watch?v=IyIAR65G-GQ
    // I used this example for my following d3 bubble chart code: https://observablehq.com/@d3/bubble-chart
    console.log(data);

    const width = '1400';
    const height = '500';
    const format = d3.format(',d');
            
    // Give each different category their own color
    const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10);

    // Select svg
    let svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);

    const render = (svg, data) => {
        // Set standards
        const pack = data => d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy({children: data})
                .sum(d => d.categoryAmount));

        const root = pack(data);
                
        // Create Groups for circles and text
        const container = svg.selectAll('.circle__container');
                
        // Give data to all groups 
        const groups = container.selectAll('g')
            .data(root.leaves());

        // Assign groups if there are not enough DOM elements available
        const groupsEnter = groups.enter().append('g');

        // Set position
        groupsEnter
            .merge(groups)
            .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`);

        // Add circles
        groupsEnter
            .append('circle')
            .attr('r', 0)
        // Merge attributes which will be updated
            .merge(groups.select('circle'))
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('fill', d => color(d.data.upperCategory));

        // Add hover information
        groupsEnter
            .append('title')
            .merge(groups.select('title'))
            .text(d => `${d.data.categoryName}\nAantal objecten: ${format(d.data.categoryAmount)}\nCategorie: ${d.data.upperCategory}`);

        // Exit and remove unused DOM elements
        groups.exit().remove();

        // Add text
        groupsEnter.append('text')
            .attr('font-size', '0')
            .attr('x', 0)
            .attr('y', 0)
        // Merge attributes which can be updated later
            .merge(groups.select('text'))
            .transition().duration(1000)
            .text(d => d.data.categoryName)
            .attr('fill', 'white')
            .attr('font-size', '11')
            .attr('display', d => {return d.r <= 25 ? 'none' : 'flex';});
    };

    // Save array in a const
    const legendData = uniqueUpperCategories(data);

    // Add legend
    const legendContainer = d3.selectAll('.legend__container');
    const legendLabels = legendContainer.selectAll('text').data(legendData);

    legendLabels.enter().append('text')
    // Filter when clicked on an upperCategory
        .attr('y', function(d, i){return 25+25*i;})
        .attr('x', 150)
        .merge(legendLabels)
    // Things that can update
        .text(d => {return d;})
        .attr('fill', d => {return color(d);})
        .on('click', d => {filterUpperCategory(d);});

    legendLabels.exit().remove();
    
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

    function filterUpperCategory(d) {
        let mappedData = data.map(item => item);
        let filterData = mappedData.filter(item => {
            if (item.upperCategory === d) {
                return item;
            }
        });
        render(svg, filterData);
    };

    render(svg, data);

    function resetCircles () {
        render(svg, data);
    }

    let button = document.getElementById('resetButton');
    button.addEventListener('click', resetCircles);
};