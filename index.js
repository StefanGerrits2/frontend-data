import cleanData from './modules/cleanData.js';
import fixCategory from './modules/fixCategory.js';
import drawVisualisation from './modules/drawVisualisation.js';
import runQuery from './modules/getData.js';

// Set active main category as default
let mainCategory = 2657;

// Run main function
runMainFunction(mainCategory);

// Main function
function runMainFunction(mainCategory) {
    runQuery(mainCategory) 
        .then(myRawResults => cleanData(myRawResults)) 
        .then(cleanedData => fixCategory(cleanedData))
        .then(finalData => drawVisualisation(finalData));
}

// Give each radio button an onclick function which runs the whole program again bases on the termmaster
document.querySelectorAll('.radio-buttons__container input').forEach(button => {
    button.addEventListener('click', () => {
        runMainFunction(button.value);
    });
});