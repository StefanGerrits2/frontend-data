# Frontend Data

## Concept

![final concept screenshot](https://user-images.githubusercontent.com/45566396/69820130-ba1d3e00-1200-11ea-9615-92b01cea7e0f.png)

![finalgifff](https://user-images.githubusercontent.com/45566396/69820923-92c77080-1202-11ea-9ae4-72502fc3cbea.gif)

### Description

This is an interactive visualisation made with d3 for Nationeel museum voor wereldculturen. I visualised categories with their subcategories so the viewer can explore their collection. How bigger the bubble, the more objects there are in that category. You can also hover over a bubble for more information.

* [Click here](https://github.com/StefanGerrits2/functional-programming/wiki/1.3-Gekozen-concept) to check out my concept in detail.

## Features

* Being able to view a different category
* Being able to filter on subcategories in every category
* Being able to reset your current filter
* Being able to hover over a bubble to see more information

### d3 updating pattern

The update pattern checks how many DOM elements already exist, and how many there are needed based on the data that is given. DOM elements can be deleted, added or updated.

Check [Mijn update pattern](https://github.com/StefanGerrits2/frontend-data/wiki/2.3-Mijn-update-pattern) for more information what an update pattern is and how I implemented it in my code.

I used [this tutorial](https://www.youtube.com/watch?v=IyIAR65G-GQ&t=3237s) made by Curran Kelleher to understand the basics.

### d3 experiments
I experimented some interactions, here's a list:
* Zoom and drag
* Basic legend
* Filtering with legend

Check [Experimenten met d3 interactie](https://github.com/StefanGerrits2/frontend-data/wiki/2.1-Experimenteren-met-d3-interactie) for more information.

### Data cleaning pattern

Check [Data cleaning pattern](https://github.com/StefanGerrits2/frontend-data/wiki/2.6-Data-cleaning-pattern) for more information how I cleaned my data so it's ready for d3.

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

Click [here](https://github.com/StefanGerrits2/frontend-data/wiki/2.5-SparQL-query) for further explanation how my query works.

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

* [MDN](https://developer.mozilla.org/nl/) - Main source for javascript code.
* [API](https://data.netwerkdigitaalerfgoed.nl/) - To get all the data I needed.
* [d3](https://d3js.org/) - To learn the basics of d3.
* [Bubble chart](https://observablehq.com/@d3/bubble-chart) - Example I used to render a basic bubble chart.
* [d3 update pattern](https://www.youtube.com/watch?v=IyIAR65G-GQ&t=3237s) - To understand the basics how the update pattern works

## Credits

* [Wessel Smit](https://github.com/WesselSmit/frontend-data/) - for showing me how to run the query with the termmaster as parameter.


## Check it out!

* [Click here to open the live link](https://stefangerrits2.github.io/frontend-data/)

## License

[MIT](https://github.com/StefanGerrits2/Frontend-Applications/blob/master/LICENSE.txt) © Stefan Gerrits
