/**
 * Class for wrapping OpenAI requests.
 */
export default class OpenAI {
   
    constructor(apiKey, engineId = "ada", frequencyPenalty=0.5, presencePenalty=0.5) {
        this.bearer_token = apiKey;
        this.engineId = engineId;
        this.frequencyPenalty = frequencyPenalty;
        this.presencePenalty = presencePenalty;
        console.log("OpenAI is initialized.");
    }

    /**
     * List engines available on OpenAI
     * @param {function} callback
     */
    async listEngines() {
        let url = "https://api.openai.com/v1/engines";
        let xhr = this.createXHRequest("GET", url);
        xhr.send();
        let response = xhr.response;
        
        return new Promise((resolve, reject) => {
            if (response) {
                console.log("Engine list response");
                console.log(response);
                resolve(response);
            }
            else reject();
        });
    }

    /**
     * Create a GPT-3 completion.
     * @param {String} prompt 
     * @param {Number} maxTokens 
     * @param {Number} stop 
     * @param {Number} callback 
     */
    async createCompletion(prompt, maxTokens, stop){
        let url = `https://api.openai.com/v1/engines/${this.engineId}/completions`;
        let requestBody = {
            "prompt": prompt,
            "max_tokens": maxTokens,
            "stop": stop,
            "presence_penalty" : this.presencePenalty,
            "frequency_penalty" : this.frequencyPenalty
        };

        let xhr = this.createXHRequest("POST", url);
        xhr.send(JSON.stringify(requestBody));
        let response = xhr.response;

        return new Promise((resolve, reject) => {
            // Todo build promise structure.
            if (response) resolve(response);
            else reject();
        });
    }

    /**
     * Create a XHR object for requests.
     * @param {String} method HTTP Method
     * @param {String} url Request URL
     * @param {function} callback Callback function
     */
    createXHRequest(method, url){
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, false);
        xhr.setRequestHeader('Authorization', "Bearer " + this.bearer_token);
        xhr.setRequestHeader('Content-Type', "application/json");
        return xhr;
    }
}