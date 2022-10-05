import NLPLayer from "./nlp-layer.js";
import CSSLayer from "./css-layer.js";

/**
 * Betim AI Model Class
 * Composition of 3 abstraction layers; STT, NLP, CSS.
 * Generates CSS code using speech or text data.
 */
export default class BetimModel {

    constructor() {
        // this.sttLayer; COMING SOON
        this.nlpLayer = new NLPLayer();
        this.cssLayer = new CSSLayer();
        console.log("Betim model is initialized.");
        this.ready = false;
    }

    /**
     * Prepares and configures all submodules of the Betim model.
     * @returns Promise
     */
    async prepareModel() {
        console.log("BetimModel: Preparing betim model.")
        // Ensure the all components are ready.
        await this.nlpLayer.prepare();
        return new Promise((resolve, reject) => {
            this.ready = true;
            resolve();
        });
    }

    /**
     * Generates CSS code using text prompt
     * @param {String} textPrompt 
     */
    async evalText(textPrompt) {
        // Check if all the components are prepared.
        if (!this.ready) throw "Betim components are not ready yet!";

        // Generate nlp result from NLP Layer
        let nlpResult = await this.nlpLayer.understand(textPrompt);
        let ast = nlpResult.ast;
        
        // Send NLP result to the CSS Layer
        let css = this.cssLayer.decodeAST(ast);

        console.log(css);

        return new Promise( (resolve, reject) => {
            if (css) {
                resolve(css);
            } else {
                reject();
            }
        })
    }

    /**
     * Generates CSS code using speech
     */
    async evalSpeech(data){
        // TODO: Implement STT layer operations
    }
}