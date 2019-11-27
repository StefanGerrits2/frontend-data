# Frontend Data

## Concept

![concept complete](https://user-images.githubusercontent.com/45566396/69720350-b3180200-1112-11ea-88b5-66287455c871.png)

![gif 6](https://user-images.githubusercontent.com/45566396/69721012-3423c900-1114-11ea-81f1-da2a8c231d97.gif)

### Description

This is an interactive visualisation made with d3 for Nationeel museum voor wereldculturen. I visualised categories with their subcategories so the viewer can explore their collection. How bigger the bubble, the more objects there are in that category. You can also hover over a bubble for more information.

* [Click here](https://github.com/StefanGerrits2/functional-programming/wiki/1.3-Gekozen-concept) to check out my concept in detail.

## Features

* Being able to view a different category
* Being able to filter on subcategories in every category
* Being able to reset your current filter
* Being able to hover over a bubble to see more information

## d3 updating pattern
Info about updating data here

* I used [this tutorial](https://www.youtube.com/watch?v=IyIAR65G-GQ&t=3237s) to understand the basics

## d3 experiments
Info about my experiments here

## Data cleaning pattern

Info about data cleaning here

## Installation

### 1. Clone this repository to your computer
Run this command in your terminal:

`git clone https://github.com/StefanGerrits2/frontend-data`
### 2. Navigate into the root of the folder
Run this command in your terminal:

`cd frontend-data`

### 3. Viewing the website
Open the `index.html` file in a browser.

>
> ###### NOTE:
> You can't just open your `index.html` file because I use es6 modoules. You need to start a live server to make it work. For example, I use the plugin `Preview on Web Server`.

## API

The data I use is provided by [this API](https://data.netwerkdigitaalerfgoed.nl/). The API contains 700.000 objects. I have written SPARQL queries to get the objects that I want. 

I collect these data:
* Category names
* Category value (amount of objects in each category)
* Upper category (subcategories can be part of a upper category)

Click [here](https://github.com/StefanGerrits2/frontend-data/wiki/2.4-SparQL-Query) for further explanation how my query works.

<details>
<summary>Click here to see a quick example of a query I have written in SPARQL.</summary>
<br>

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

    ORDER BY DESC(?categoryAmount)

    LIMIT 100

</details>

## Sources

* [MDN](https://developer.mozilla.org/nl/) - Main source for javascript code
* [API](https://data.netwerkdigitaalerfgoed.nl/) - To get all the data I needed.
* [d3](https://d3js.org/) - To learn the basics of d3.
* [Bubble chart](https://observablehq.com/@d3/bubble-chart) - Example I used to render a basic bubble chart.
* [d3 update pattern](https://www.youtube.com/watch?v=IyIAR65G-GQ&t=3237s) - To understand the basics how the update pattern works

## Credits

* Credits here

## Check it out!

* [Click here to open the live link](https://stefangerrits2.github.io/frontend-data/)

## License

[MIT](https://github.com/StefanGerrits2/Frontend-Applications/blob/master/LICENSE.txt) © Stefan Gerrits
