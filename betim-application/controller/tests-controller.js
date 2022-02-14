import NLPLayer from "../model/betim/nlp-layer.js";

let betimNlp = new NLPLayer();

let testSet = []
let testItemIndex = 0;

/**
 * Test Values
 */
let totalExamples = 0;
let trueExamples = 0;
let falseExamples = 0;

let totalSelectors = 0;
let trueSelectors= 0;
let falseSelectors= 0;

let totalProperties = 0;
let trueProperties = 0;
let falseProperties = 0;

let totalValues = 0;
let trueValues = 0;
let falseValues = 0;

/**
 * UI components
 */
let cellExampleTotal;
let cellExampleTrue;
let cellExampleTruePercent;
let cellExampleFalse;
let cellExampleFalsePercent;

let cellSelectorTotal;
let cellSelectorTrue;
let cellSelectorTruePercent;
let cellSelectorFalse;
let cellSelectorFalsePercent;

let cellPropertyTotal;
let cellPropertyTrue;
let cellPropertyTruePercent;
let cellPropertyFalse;
let cellPropertyFalsePercent;

let cellValueTotal
let cellValueTrue;
let cellValueTruePercent;
let cellValueFalse;
let cellValueFalsePercent;


window.onload = function() {
    loadTestSet();
    initElements();
    let startTestButton = document.querySelector("#btnStartTest");
    startTestButton.onclick = startTest;
}


/**
 * Generates mock data for testing test software
 */
function simulateTest() {
    totalExamples = 3;
    totalSelectors = 3;
    totalProperties = 3;
    totalValues = 3;

    trueExamples = 0;
    trueSelectors = 1;
    trueProperties = 2;
    trueValues = 0;

    falseExamples = 3;
    falseSelectors = 2;
    falseProperties = 1;
    falseValues = 3;

    addFailedCase(0, "Make background black {selector, property, value} <> ");
    addFailedCase(1, "Forest");
    addFailedCase(2, "Team");

    updateUi();
}



function initElements() {
    cellExampleTotal = document.querySelector("#exampleTotal");
    cellExampleTrue = document.querySelector("#exampleTrue");
    cellExampleTruePercent = document.querySelector("#exampleTruePercent");
    cellExampleFalse = document.querySelector("#exampleFalse");
    cellExampleFalsePercent = document.querySelector("#exampleFalsePercent");

    cellSelectorTotal = document.querySelector("#selectorTotal");
    cellSelectorTrue = document.querySelector("#selectorTrue");
    cellSelectorTruePercent = document.querySelector("#selectorTruePercent");
    cellSelectorFalse = document.querySelector("#selectorFalse");
    cellSelectorFalsePercent = document.querySelector("#selectorFalsePercent");

    cellPropertyTotal = document.querySelector("#propertyTotal");
    cellPropertyTrue = document.querySelector("#propertyTrue");
    cellPropertyTruePercent = document.querySelector("#propertyTruePercent");
    cellPropertyFalse = document.querySelector("#propertyFalse");
    cellPropertyFalsePercent = document.querySelector("#propertyFalsePercent");

    cellValueTotal = document.querySelector("#valueTotal");
    cellValueTrue = document.querySelector("#valueTrue");
    cellValueTruePercent = document.querySelector("#valueTruePercent");
    cellValueFalse = document.querySelector("#valueFalse");
    cellValueFalsePercent = document.querySelector("#valueFalsePercent");
}

/** 
 * Start test operation 
 * */
function startTest() {
    console.log("Started testing.");
    // For each test element
    testExample();
}

/**
 * Load test dataset
 */
function loadTestSet() {
    fetch("../../test-data/decorations.tsv").then( (data) => {
        betimNlp.prepare().then(() => {
            console.log("Betim NLP is ready.");
        });

        data.text().then((text) => {
            testSet = text.split("\n");
            console.log(testSet);

            let testSetStatus = document.querySelector("#betimTestSetStatus")
            testSetStatus.innerText = "" + testSet.length + " examples loaded."
        })
    })
}

/**
 * Test a single example
 */
function testExample() {
    let testItem = testSet[testItemIndex];
    let testItemParts = testItem.split("\t");

    let examplePrompt = testItemParts[0];
    let trueSelector = testItemParts[1];
    let trueProperty = testItemParts[2];
    let trueValue = testItemParts[3];

    // Call betim model
    betimNlp.understand(examplePrompt).then((ast) => {
        evaluateResult(testItemIndex, ast, trueSelector, trueProperty, trueValue, examplePrompt);
    });

    testItemIndex++;
    if (testItemIndex >= testSet.length) {
        alert("Testing done.");
        return;
    };

    setTimeout(testExample, 500);
}

function evaluateResult(testItemIndex, ast, trueSelector, trueProperty, trueValue, examplePrompt) {
    // Get selector and declaration blocks.
    let selectorGroup = ast.ast[0].selectorGroup;
    let declarationBlock = ast.ast[0].declarationBlock;

    // Validate AST format.
    if (!selectorGroup || !declarationBlock) {
        // Handle error
        console.error("Malformed ast object.");
        addFailedCase("No resullt:" + examplePrompt)
        return;
    }

    // Decode selector group
    let estimatedSelector = "";
    for (let i=0; i<selectorGroup.length; i++) {
        estimatedSelector += selectorGroup[i].name;
        
        if (i != selectorGroup.length - 1)
            estimatedSelector += ", "
    }

    let declaration = declarationBlock[0];
    let estimatedProperty = declaration.property;
    let estimatedValue = declaration.value;
    
    let isSelectorTrue = false;
    let isPropertyTrue = false;
    let isValueTrue = false;

    // Calculations
    totalSelectors += 1;
    if (estimatedSelector.trim() === trueSelector.trim()) {
        trueSelectors += 1;
        isSelectorTrue = true;
    }
        
    else falseSelectors += 1;

    totalProperties += 1;
    if (estimatedProperty.trim() === trueProperty.trim()) {
        trueProperties += 1;
        isPropertyTrue = true;
    }
    else falseProperties += 1;

    if (trueValue.trim() !== "*") {
        totalValues += 1
        if (estimatedValue.trim() === trueValue.trim()) {
            isValueTrue = true;
            trueValues += 1;
        }
        else falseValues += 1;
    } else {
        isValueTrue = true;  
    } 
    
    totalExamples += 1;
    if (isValueTrue && isPropertyTrue && isSelectorTrue) {
        trueExamples += 1;
    } else {
        falseExamples += 1;
        addFailedCase(testItemIndex, examplePrompt + `\n{${trueSelector}, ${trueProperty}, ${trueValue}} <> {${estimatedSelector}, ${estimatedProperty},${estimatedValue}}`);
    }
    updateUi();
}

function updateUi() {
    cellExampleTotal = document.querySelector("#exampleTotal");
    cellExampleTrue = document.querySelector("#exampleTrue");
    cellExampleTruePercent = document.querySelector("#exampleTruePercent");
    cellExampleFalse = document.querySelector("#exampleFalse");
    cellExampleFalsePercent = document.querySelector("#exampleFalsePercent");

    cellSelectorTotal = document.querySelector("#selectorTotal");
    cellSelectorTrue = document.querySelector("#selectorTrue");
    cellSelectorTruePercent = document.querySelector("#selectorTruePercent");
    cellSelectorFalse = document.querySelector("#selectorFalse");
    cellSelectorFalsePercent = document.querySelector("#selectorFalsePercent");

    cellPropertyTotal = document.querySelector("#propertyTotal");
    cellPropertyTrue = document.querySelector("#propertyTrue");
    cellPropertyTruePercent = document.querySelector("#propertyTruePercent");
    cellPropertyFalse = document.querySelector("#propertyFalse");
    cellPropertyFalsePercent = document.querySelector("#propertyFalsePercent");

    cellValueTotal = document.querySelector("#valueTotal");
    cellValueTrue = document.querySelector("#valueTrue");
    cellValueTruePercent = document.querySelector("#valueTruePercent");
    cellValueFalse = document.querySelector("#valueFalse");
    cellValueFalsePercent = document.querySelector("#valueFalsePercent");

    cellExampleTotal.innerText = totalExamples;
    cellExampleTrue.innerText = trueExamples;
    cellExampleFalse.innerText = falseExamples;
    cellExampleTruePercent.innerText = ""+ ((trueExamples/totalExamples)*100).toFixed(2) + "%";
    cellExampleFalsePercent.innerText = "" + ((falseExamples/totalExamples)).toFixed(2)*100 + "%";

    cellSelectorTotal.innerText = totalSelectors;
    cellSelectorTrue.innerText = trueSelectors;
    cellSelectorFalse.innerText = falseSelectors;
    cellSelectorTruePercent.innerText = ""+ ((trueSelectors/totalSelectors)*100).toFixed(2) + "%";
    cellSelectorFalsePercent.innerText = "" + ((falseSelectors/totalSelectors)*100).toFixed(2) + "%";

    cellPropertyTotal.innerText = totalProperties;
    cellPropertyTrue.innerText = trueProperties;
    cellPropertyFalse.innerText = falseProperties;
    cellPropertyTruePercent.innerText = ""+ ((trueProperties/totalProperties)*100).toFixed(2) + "%";
    cellPropertyFalsePercent.innerText = "" + ((falseProperties/totalProperties)*100).toFixed(2) + "%";

    cellValueTotal.innerText = totalValues;
    cellValueTrue.innerText = trueValues;
    cellValueFalse.innerText = falseValues;
    cellValueTruePercent.innerText = ""+ ((trueValues/totalValues)*100).toFixed(2) + "%";
    cellValueFalsePercent.innerText = "" + ((falseValues/totalValues)*100).toFixed(2) + "%";
}

function addFailedCase(testItemIndex, truth) {
    let failureDiv = document.querySelector("#testLogContainer");

    let failedCase = `
    <div class="failedCaseDiv" id="failedCase-${testItemIndex}">
        <p>${truth}</p>
        <div> 
            <button id="btnFix-${testItemIndex}" class="btnFailureCorrectFix" 
            data-test-item-index="${testItemIndex}">Fix</button>
        </div>
    </div>
    `;

    failureDiv.innerHTML += failedCase;
    setFixButtonEvents();
}

function setFixButtonEvents() {
    let nodeList = document.querySelectorAll(".btnFailureCorrectFix");

    for (let i=0; i<nodeList.length; i++) {
        let n = nodeList[i];
        n.onclick = function(e) {
            console.log(e);
            let testItemIndex = e.target.dataset.testItemIndex;
            openFixForm(testItemIndex);
        }
    }
}


function openFixForm(testItemIndex) {
    // TODO: Ensure the consistency here
    let failedCaseTruth = document.querySelector(`#failedCase-${testItemIndex} p`);
    let truth = failedCaseTruth.innerText;

    let modalContent = `
    <div class="modal" id="fixModal-${testItemIndex}">
        <h2>Fix test result</h3>
        <p>${truth}</p>
        
        <div>
            <input type="checkbox" id="checkOutput">
            <label>Output</label>
        </div>

        <div>
            <input type="checkbox" id="checkSelector">
            <label>Selector</label>
        </div>

        <div>
            <input type="checkbox" id="checkProperty">
            <label>Property</label>
        </div>

        <div style= "margin-bottom: 1rem">
            <input type="checkbox" id="checkValue">
            <label>Value</label>
        </div>

        <button id="btnFixResults-${testItemIndex}" class="btnFixResuls" style="background-color: green; color: white"
            data-test-item-index="${testItemIndex}">Fix Results </button>

        <button id="btnCancelFix-${testItemIndex}"  style="background-color: red; color: white"
            data-test-item-index="${testItemIndex}">Cancel </button>

    </div>
    `;

    document.body.innerHTML += modalContent;

    // Add events
    let btnFix = document.querySelector(`#btnFixResults-${testItemIndex}`);

    btnFix.onclick = function(e) {
        let testItemIndex = e.target.dataset.testItemIndex;
        fixAction(testItemIndex);
        closeFixForm();

        // Remove failed case div
        let failedCaseDiv = document.querySelector(`#failedCase-${testItemIndex}`);
        failedCaseDiv.remove();
        setFixButtonEvents();
    }

    let btnCancel = document.querySelector(`#btnCancelFix-${testItemIndex}`);
    btnCancel.onclick = function (e) {
        let testItemIndex = e.target.dataset.testItemIndex;
        closeFixForm()
    } 

}

/**
 * Closes fix form modal
 */
function closeFixForm() {
    let modals = document.querySelectorAll(".modal");
    for (let i=0; i<modals.length; i++) {
        let node = modals[i];
        node.remove();
    }
    setFixButtonEvents();
}

/**
 * Fixes test result values then updates UI
 * @param {Number} testItemIndex 
 */
function fixAction(testItemIndex) {
    let checkOutput = document.querySelector(`#fixModal-${testItemIndex} #checkOutput`)
    let checkSelector = document.querySelector(`#fixModal-${testItemIndex} #checkSelector`);
    let checkProperty = document.querySelector(`#fixModal-${testItemIndex} #checkProperty`);
    let checkValue = document.querySelector(`#fixModal-${testItemIndex} #checkValue`);

    let isOutputChecked = checkOutput.checked;
    let isSelectorFixed = checkSelector.checked;
    let isPropertyFixed = checkProperty.checked;
    let isValueFixed = checkValue.checked;

    // Check if output is correct
    if (isOutputChecked) {
        // Fix output accuracy
        falseExamples -= 1;
        trueExamples += 1;
    }

    if (isSelectorFixed) {
        falseSelectors--;
        trueSelectors++;
    }

    if (isPropertyFixed) {
        falseProperties--;
        trueProperties++;
    }

    if (isValueFixed) {
        falseValues--;
        trueValues++;
    }

    updateUi();
}


