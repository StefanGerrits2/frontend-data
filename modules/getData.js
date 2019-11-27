// First part of query
const query1 = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?categoryName (COUNT(?category) AS ?categoryAmount) ?upperCategory

    WHERE {
        <https://hdl.handle.net/20.500.11840/termmaster`;    

// Second part of query
const query2 = `> skos:narrower* ?category .
        ?category skos:prefLabel ?categoryName .
        ?obj edm:isRelatedTo ?category .
        ?category skos:broader ?categoryGroup .
        ?categoryGroup skos:prefLabel ?upperCategory .
    }
    
    ORDER BY DESC(?categoryAmount) 

    LIMIT 100
`;

// Endpoint url
const url = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-03/sparql';

// Function to fetch data
export default async function runQuery(mainCategory){
    let response = await fetch(url+'?query='+ encodeURIComponent(query1 + mainCategory + query2) +'&format=json'); // Fetch data into response
    let json = await response.json(); // When the data is obtained, change it to JSON
    return json.results.bindings; // Return data.bindings
}