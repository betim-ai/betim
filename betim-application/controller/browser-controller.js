import BetimModel from "../model/betim/betim-model.js";

let betimModel = new BetimModel();
betimModel.openAI.listEngines((a, b) => {
    console.log(a);
})

betimModel.openAI.createCompletion("Hello ", 40, ".", (a, b)=>{
    console.log(a);
})

window.onload = () => {
    // Todo On page loaded activites
    console.log("I born")
    
}