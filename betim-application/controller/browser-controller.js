import BetimModel from "../model/betim/betim-model.js";
import NLPLayer from "../model/betim/nlp-layer.js";
import OpenAI from "../model/gpt-3/openai-wrapper.js"

let betimModel = new BetimModel();
let nlpLayer = new NLPLayer();
let openai = new OpenAI("sk-t2oXJMSWR0MppX8IXWEOdq10AEW2CYDIvM2NMMpl");

openai.listEngines().then( (response) => {
});

/*
nlpLayer.prepare();
nlpLayer.understand("Make paragraph color blue.", (result) => {
    alert(result)
});
*/
window.onload = () => {
    // Todo On page loaded activites
    console.log("Browser window loaded");
    document.querySelector("#btnLoad").addEventListener('click', loadUrl);
}

function loadUrl(){
    alert("Yükleee");
}