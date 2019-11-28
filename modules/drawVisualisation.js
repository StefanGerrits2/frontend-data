export default function drawVisualisation(data) {
    // Tutorial I followed for my update pattern: https://www.youtube.com/watch?v=IyIAR65G-GQ
    // I used this example for my following d3 bubble chart code: https://observablehq.com/@d3/bubble-chart
    
    console.log(data);

    // Set standards
    const width = 1400;
    const height = 500;
            
    // Give each different category their own color
    const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10);

    // Select svg
    let svg = d3.select('svg')
        .attr('viewBox', [0, 0, width, height]);

    function render(svg, data) {
        // Set position and size of bubbles
        const pack = data => d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy({children: data})
                .sum(d => d.categoryAmount));

        const root = pack(data);
        
        // Create Groups for circles and text
        const circleContainer = svg.selectAll('.circle__container');
                
        // Give data to all groups 
        const groups = circleContainer.selectAll('g')
            .data(root.leaves());

        // Assign groups if there are not enough DOM elements available
        const groupsEnter = groups.enter().append('g');

        // Set position
        groupsEnter
            // Enter and update
            .merge(groups)
            .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`);
        
        // Add circles
        groupsEnter
            // Set values which won't change when updated
            .append('circle')
            .attr('r', 0)
            // Enter and update
            .merge(groups.select('circle'))
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('fill', d => color(d.data.upperCategory));

        // Add hover information
        groupsEnter
            // Set values which won't change when updated
            .append('title')
            // Enter and update
            .merge(groups.select('title'))
            .text(d => `${d.data.categoryName}\nAantal objecten: ${d.data.categoryAmount}\nCategorie: ${d.data.upperCategory}`);

        // Add text
        groupsEnter.append('text')
            // Set values which won't change when updated
            .attr('font-size', '0')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', 'white')
            // Enter and update
            .merge(groups.select('text'))
            .transition().duration(1000)
            .text(d => d.data.categoryName)
            .attr('font-size', '9')
            .attr('display', d => {return d.r <= 25 ? 'none' : 'flex';});

        // Exit and remove unused DOM elements
        groups.exit().remove();
    };

    // Save array in a const
    const legendData = uniqueUpperCategories(data);

    // Add legend
    const legendContainer = d3.selectAll('.legend__container');
    const legendLabels = legendContainer.selectAll('text').data(legendData);

    // Add text to legend
    legendLabels.enter().append('text')
        // Set values which won't change when updated
        .attr('y', (d, i) => {return 25+25*i;})
        .attr('x', 150)
        // Enter and update
        .merge(legendLabels)
        .text(d => {return d;})
        .attr('fill', d => {return color(d);})
        .on('click', d => {filterUpperCategory(d);});

    // Exit and remove unused DOM elements
    legendLabels.exit().remove();
    
    // Get unique upperCategories
    function uniqueUpperCategories(data) {
        let arr = [];
        for (let key in data) {
            arr.push(data[key].upperCategory);
        }
        // Source used for this filter function: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
        let uniqueArray = arr.filter((item, pos) => {
            return arr.indexOf(item) == pos;
        });
        return uniqueArray;
    };

    // Filter data based on clicked subcategory
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

    // Reset filter
    function resetCircles () {
        render(svg, data);
    }

    // Reset button
    let button = document.getElementById('resetButton');
    button.addEventListener('click', resetCircles);
};