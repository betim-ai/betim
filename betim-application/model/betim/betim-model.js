/**
 * Betim AI Model Class
 * Composition of 3 abstraction layers; STT, NLP, CSS.
 * Generates CSS code using speech or text data.
 */
export default class BetimModel {
    // TODO: Implement sub layers

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