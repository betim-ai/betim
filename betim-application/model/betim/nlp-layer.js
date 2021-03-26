import OpenAI from "../gpt-3/openai-wrapper.js"

/**
 * Represents NLP layer of the Betim Model.
 * Comminucates with GPT-3 using OpenAI api.
 */
export default class NLPLayer {

    constructor() {
        this.openAI = new OpenAI("sk-t2oXJMSWR0MppX8IXWEOdq10AEW2CYDIvM2NMMpl", "babbage");
        console.log("NLPLayer is initialized.");
        this.prepare()
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

        Make background black for cards=>selector:"card", property:"background-color", value:"#000";
        Make headings bigger=>selector:"h1, h2, h3, h4, h5, h6", property:"transform", value:"scale(1.10)";
        Change paragraph color green=>selector:"p", property:"color", value:"#00ff00";
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
        console.log(formattedPrompt, gptOutput);
        return new Promise( (resolve, reject) => {
            let ast = this.genereteAST(gptOutput.choices[0].text);
            if (ast) {
                console.log("AST", ast)
                resolve(ast);
            }
            else reject();
        });
    }

    /**
     * Generate abstract syntax tree using given input.
     * TODO: Ensure fail safety
     * @param {String} query 
     */
    genereteAST(query) {
        // Ex: selector:"h1, h2, h3, h4, h5, h6", property:"transform", value:"scale(1.10)"
        // Extract parameters and values
        let removedVal = query.replace(/"[\w\s,()*!.\#"]*"/g, "");
        let parameters = removedVal.split(",");
        let values = query.match(/"[\w\s,()*!.\#"]*"/g);
    
        if (parameters.length != parameters.length) {
            return undefined;
        }

        let queryObj={};
        for (let i=0; i<parameters.length; i++) {
            let parameter = parameters[i].trim().replace(":", "");
            let value = values[i].trim();
            // Clear boundary quotes if exist.
            if (value.charAt(0) === '"' && value.charAt(value.length -1) === '"') {
                value = value.substr(1,value.length- 2);
            }
            queryObj[parameter] = value;
        }

        // Check if the generated data is valid.
        if (!queryObj.selector || !queryObj.property || !queryObj.value) {
            console.error("Query parse error in NLPLayer", query);
            return undefined;
        }
    
        // TODO: Parse selector syntax
        let ast = [
            {
                "selectorGroup": [
                    { "name": queryObj.selector }
                ],
                
                "declarationBlock" : [
                    {"property": queryObj.property, "value": queryObj.value, "important": true}
                ]
            }
        ];
    
        return {
            "raw" : query,
            "query": queryObj,
            "ast" : ast
        }
    }
}