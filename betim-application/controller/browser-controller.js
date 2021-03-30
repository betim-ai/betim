import BetimModel from "../model/betim/betim-model.js";

let betim = new BetimModel();
let webview = undefined;

window.onload = () => {
    // Todo On page loaded activites
    console.log("Browser window loaded");
    document.querySelector("#btnLoad").addEventListener('click', loadUrl);
    webview = document.querySelector("#contentFrame");
}

function loadUrl(){
    let userInput = document.querySelector("#barInputURL");
    console.log("SA");

    betim.evalText(userInput.value).then( (result) => { 
            webview.insertCSS(result)
        }
    );

}