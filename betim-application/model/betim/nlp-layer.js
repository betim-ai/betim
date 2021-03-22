import OpenAI from "../gpt-3/openai-wrapper.js"

/**
 * Represents NLP layer of the Betim Model.
 * Comminucates with GPT-3 using OpenAI api.
 */
export default class NLPLayer {

    constructor() {
        this.openAI = new OpenAI("sk-t2oXJMSWR0MppX8IXWEOdq10AEW2CYDIvM2NMMpl", "babbage");
        console.log("NLPLayer is initialized.");
    }

    /**
     * Prepare GPT-3 model
     */
    prepare() {
        /**
         * TODO: Dynamic fine tuning prompt generation.
         * GPT-3 Fine Tuning Prompt
         */
        this.fineTuningPrompt = `
        Generating CSS Rules

        Make background black for cards=>selector:"card",  property:"background-color", value="#000";
        Make headings bigger=>selector:"h1, h2, h3, h4, h5, h6", property:"transform", value="scale(1.10)";

        `
    }

    /**
     * Understand the user request which is given in natural language, 
     * using GPT-3 through OpenAI wrapper. Then generete syntax tree in  JSON format.
     * @param {String} prompt 
     */
    async understand(prompt) {
        // GPT-3 Comminucation
        let formattedPrompt = this.fineTuningPrompt + `${prompt}=>`;
        let gptOutput = await this.openAI.createCompletion(formattedPrompt, 40, ";");

        return new Promise( (resolve, reject) => {
            let ast = this.genereteAST(gptOutput.choices[0].text);
            if (ast) {
                console.log("NLPLayer prompt: ", prompt, ast);
                resolve(ast);
            }
            else reject();
        });
    }

    /**
     * Generate abstract syntax tree using given input.
     * @param {String} query 
     */
    genereteAST(query) {
        // TODO: Decode string and generete AST
        return {
            "raw" : query
        }
    }
}