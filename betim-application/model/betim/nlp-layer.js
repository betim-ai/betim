import OpenAI from "../gpt-3/openai-wrapper.js"

/**
 * Betim NLP Layer Class
 * Represents NLP layer of the Betim Model.
 * Comminucates with GPT-3 using OpenAI api.
 */
export default class NLPLayer {

    constructor() {
        this.ready = false;
        this.openAI = undefined;
        console.log("NLPLayer is initialized.");
    }

    /**
     * Prepares GPT-3 model
     */
    async prepare() {
        // Initialize openAI
        console.log("NLP: Initializing OpenAI...");
        let secretsResponse = await fetch("../../secrets.json");        
        if (!secretsResponse) throw "NLP: Cannot read secrets file.";
        
        let secretsText = await secretsResponse.text();
        let secretsData = JSON.parse(secretsText);
        if (!secretsData) throw "NLP: Cannot parse secrets file.";
        
        let openAIKey = secretsData.open_ai_key;
        if (!openAIKey) throw "NLP: Cannot find openapi key.";

        this.openAI = new OpenAI(openAIKey, "davinci");
        console.log("NLP: OpenAPI is initialized.");

        // GPT-3 default finetuning prompt
        this.fineTuningPrompt = `
        Generating CSS Rules

        Make background black for cards=>selector:"card", property:"background-color", value:"#000";
        Make headings bigger=>selector:"h1, h2, h3, h4, h5, h6", property:"transform", value:"scale(1.10)";
        Change paragraph color green=>selector:"p", property:"color", value:"#00ff00";
        Make background red=>selector:"body", property:"color", value:"red";
       `

       // Try to fetch prompt data from external file
       console.log("NLP: Trying to fetch external tuning-prompt file...")
        let externalTuningResponse = await fetch("../../tuning-prompt");
        let externalTuningPrompt = await externalTuningResponse.text();

        if (externalTuningPrompt) {
            this.fineTuningPrompt = externalTuningPrompt;
            console.log("Read the tuning prompt:");
            console.log(externalTuningPrompt);
            console.log("NLP: Updated fine tuning prompt from external file.");
        }
        console.log("NLP layer is prepared.");
        
        return new Promise( (resolve) => {
            this.ready = true;
            resolve(this);
        })
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
        console.log(formattedPrompt, gptOutput.choices[0].text);
        return new Promise( (resolve, reject) => {
            let ast = this.genereteASTStructural(gptOutput.choices[0].text);
            if (ast) {
                console.log("AST", ast)
                resolve(ast);
            }
            else reject();
        });
    }

    isReady() {
        return this.ready;
    }

    /**
     * Generate abstract syntax tree using given input.
     * TODO: Ensure fail safety
     * @param {String} query 
     */
    genereteASTStructural(query) {
        // Ex: selector:"h1, h2, h3, h4, h5, h6", property:"transform", value:"scale(1.10)"
        // Extract parameters and values
        let removedVal = query.replace(/"[\w\s,()*!.\#\-"]*"/g, "");
        let parameters = removedVal.split(",");
        let values = query.match(/"[\w\s,()*!.\#\-"]*"/g);
    
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

    generateASTNatural(query) {
        // Verify the css syntax and generate an AST object
        // Ex: selector:"h1, h2, h3, h4, h5, h6 {transform: scale(1.10)}
        let queryParts = query.split("{");
        let selectorSection = queryParts[0];
        
        // extract selectors
        let selectors = selectorSection.split(",");
        selectors = selectors.map((e) => {return e.trim()})

        let declarativeParts = queryParts[1].split(":");
        let property = declarativeParts[0].trim();
        let value = declarativeParts[1]
            .trim()
            .replace("}", "")
            .replace(";", "");

        let ast = [
                {
                    "selectorGroup": [
                        { "name": selectors }
                    ],
                    
                    "declarationBlock" : [
                        {"property": property, "value": value, "important": true}
                    ]
                }
            ];
        return ast;
    }
}