/**
 * Class for wrapping OpenAI requests.
 */
export default class OpenAI {
    //TODO: Implement OpenAI requests.
    constructor(bearerToken, engineId = "ada", frequencyPenalty=0.5, presencePenalty=0.5) {
        this.bearer_token = bearerToken;
        this.engineId = engineId;
        this.frequencyPenalty = frequencyPenalty;
        this.presencePenalty = presencePenalty;

        console.log("OpenAI is initialized.");
    }

    /**
     * List engines available on OpenAI
     * @param {function} callback
     */
    listEngines(callback) {
        let url = "https://api.openai.com/v1/engines";
        let xhr = this.createXHRequest("GET", url, callback);
        xhr.send();
        console.log("List engines request sent.");
        if (!callback) return xhr.response;
    }

    /**
     * Create a GPT completion.
     * @param {String} prompt 
     * @param {Number} maxTokens 
     * @param {Number} stop 
     * @param {Number} callback 
     */
    createCompletion(prompt, maxTokens, stop, callback){
        let url = `https://api.openai.com/v1/engines/${this.engineId}/completions`;
        let requestBody = {
            "prompt": prompt,
            "max_tokens": maxTokens,
            "stop": stop
        };

        let xhr = this.createXHRequest("POST", url, callback);
        xhr.send();
    }


    /**
     * Create a XHR object for requests.
     * @param {String} method HTTP Method
     * @param {String} url Request URL
     * @param {function} callback Callback function
     */
    createXHRequest(method, url, callback){
        let xhr = new XMLHttpRequest();

        if (callback) {
            xhr.open(method, url, true);
            xhr.onload = () => {
                callback(JSON.parse(xhr.response), xhr.status);
            }

        } else {
            xhr.open(method, url, false);
        }
        
        xhr.setRequestHeader('Authorization', "Bearer " + this.bearer_token);
        return xhr;
    }
}