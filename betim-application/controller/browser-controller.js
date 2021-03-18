import BetimModel from "../model/betim/betim-model.js";
import NLPLayer from "../model/betim/nlp-layer.js";

let betimModel = new BetimModel();
let nlpLayer = new NLPLayer();

nlpLayer.prepare();
nlpLayer.understand("Make paragraph color blue.", (result) => {
    alert(result)
});

window.onload = () => {
    // Todo On page loaded activites
    console.log("Browser window loaded");
    
}