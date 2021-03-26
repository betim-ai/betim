/**
 * Betim AI Model Class
 * Composition of 3 abstraction layers; STT, NLP, CSS.
 * Generates CSS code using speech or text data.
 */

import NLPLayer from "nlp-layer.js";
import CSSLayer from "./css-layer.js";

export default class BetimModel {
    // TODO: Implement sub layers

    constructor() {
        // this.sttLayer;
        this.nlpLayer = new NLPLayer();
        this.cssLayer = new CSSLayer();
        console.log("Betim model is initialized.");
    }

    /**
     * Generates CSS code using text prompt
     * @param {String} textPrompt 
     */
    async evalText(textPrompt) {
        // TODO: Implement betim model
        let ast = await this.nlpLayer.understand(textPrompt);

        console.log(textPrompt);
    }

    /**
     * Generates CSS code using speech
     */
    async evalSpeech(data){
        // TODO: Implement STT layer operations
    }
}