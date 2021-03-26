import NLPLayer from "../model/betim/nlp-layer.js";

let nlpLayer = new NLPLayer();

window.onload = () => {
    // Todo On page loaded activites
    console.log("Browser window loaded");
    document.querySelector("#btnLoad").addEventListener('click', loadUrl);
}

function loadUrl(){
    let userInput = document.querySelector("#barInputURL");
    console.log("SA");
    nlpLayer.understand(userInput.value).then( (result) => {
    });

}