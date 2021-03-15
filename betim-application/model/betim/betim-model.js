/**
 * Betim AI Model Class
 * Composition of 3 abstraction layers; STT, NLP, CSS.
 * Generates CSS code using speech or text data.
 */

import OpenAI from "../gpt-3/openai-wrapper.js";

export default class BetimModel {
    // TODO: Implement sub layers

    constructor() {
        this.openAI = new OpenAI("sk-t2oXJMSWR0MppX8IXWEOdq10AEW2CYDIvM2NMMpl");
        console.log("Betim model is initialized.");
    }

    /**
     * Generates CSS code using text prompt
     * @param {String} textPrompt 
     */
    evalText(textPrompt) {
        // TODO: Implement betim model
        console.log(textPrompt);
        
    }

    /**
     * Generates CSS code using speech
     */
    evalSpeech(data){
        // TODO: Implement STT layer operations
    }
}