import OpenAI from "../gpt-3/openai-wrapper.js"

/**
 * Represents NLP layer of the Betim Model.
 * Comminucates with GPT-3 using OpenAI api.
 */
export default class NLPLayer {

    constructor() {
        this.openAI = new OpenAI("sk-t2oXJMSWR0MppX8IXWEOdq10AEW2CYDIvM2NMMpl", "curie");
        console.log("NLPLayer is initialized.");
    }

    /**
     * Prepare GPT-3 model
     */
    async prepare() {
        /**
         * GPT-3 Fine Tuning Prompt
         */
        this.fineTuningPrompt = `
            Generating CSS Rules

            Make background black for cards$class="card"&property="background-color: #000";
            Make font red for body$[class: "body", property: "color: red"];
            Set the background of the navbar as white$[class: "navbar", property:"background-color: #ffffff"];
            Make buttons white$[class: "button", property: "background-color: #ffffff"];
            Reduce the opacity of the cards by 0.2$[class: "card", property: "opacity: 0.8"];
        `
        let promise = await this.openAI.createCompletion(this.fineTuningPrompt, 2, ";");
        // TODO: Return promise
    }

    async understand(prompt) {
        // GPT-3 Comminucation
        let formattedPrompt = this.fineTuningPrompt + `${prompt} ->`;
        this.openAI.createCompletion(formattedPrompt, 40, ";", (response, status) => {
            console.log(response);
            //TODO: Error handling
        });

        // TODO: Return promise
    }
}