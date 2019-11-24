import cleanData from './modules/cleanData.js'
import fixCategory from './modules/fixCategory.js'
const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?categoryName (COUNT(?category) AS ?categoryAmount) ?upperCategory
    WHERE {
    <https://hdl.handle.net/20.500.11840/termmaster2704> skos:narrower* ?category .
    ?category skos:prefLabel ?categoryName .
    ?obj edm:isRelatedTo ?category .
    ?category skos:broader ?categoryGroup .
    ?categoryGroup skos:prefLabel ?upperCategory .
    } 
    LIMIT 100
    `
const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql";
runQuery(url, query) // Run function to fetch data
    .then(myRawResults => cleanData(myRawResults)) // When data is obtained, pass data into a new function
    .then(cleanedData => fixCategory(cleanedData))
    .then(data => {
        console.log(data)
        // I used this example for my following code: https://observablehq.com/@d3/bubble-chart
        const width = '1400';
        const height = '450';
        // Give each different category their own color
        const color = d3.scaleOrdinal(data.map(d => d.upperCategory), d3.schemeCategory10);

        // Select svg
        let svg = d3.select('svg')
            .attr('viewBox', [0, 0, width, height])

        const render = (svg, data) => {
              // Set standards
            const pack = data => d3.pack()
                .size([width - 2, height - 2])
                .padding(3)
                (d3.hierarchy({children: data})
                    .sum(d => d.categoryAmount));

            const root = pack(data);
    
            const circles = svg.selectAll('circle').data(root.leaves());

            // Create circles
            circles
                .enter()
                    .append('circle')
                    .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`)
                    .attr('r', 0)
                // Merge attributes which can be updated later
                .merge(circles)
                .transition().duration(1500)
                    .attr('r', d => d.r)
                    .attr('fill', d => color(d.data.upperCategory))

            // Exit and remove unused DOM elements
            circles
                .exit().remove()
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
            .text(d => {return d;})
            // Filter when clicked on an upperCategory
            .on('click', d => {filterUpperCategory(d);});

        function filterUpperCategory(d) {
            let mappedData = data.map(item => item);
            let filterData = mappedData.filter(item => {
                if (item.upperCategory === d) {
                    return item;
                }
            });
            render(svg, filterData)
        };

        render(svg, data);

        function reset () {
            render(svg, data)
        }

        let button = document.getElementById('button')
        button.addEventListener('click', reset)
    })


async function runQuery(url, query){
    let response = await fetch(url+'?query='+ encodeURIComponent(query) +'&format=json'); // Fetch data into response
    let json = await response.json(); // When the data is obtained, change it to JSON
    return json.results.bindings; // Return data.bindings
}