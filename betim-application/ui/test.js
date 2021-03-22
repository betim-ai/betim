function genereteAST(query) {
    // Ex: selector:"h1, h2, h3, h4, h5, h6", property:"transform", value:"scale(1.10)"
    
    // Extract parameters and values
    let removedVal = query.replace(/"[\w\s,()*!."]*"/g, "");
    let parameters = removedVal.split(",");
    let values = query.match(/"[\w\s,()*!."]*"/g);

    if (parameters.length != parameters.length) {

    }
    let queryObj={};
    for (let i=0; i<parameters.length; i++) {
        let parameter = parameters[i].trim().replace(":", "");
        let value = values[i].trim();
        // Clear boundary quotes
        if (value.charAt(0) === '"' && value.charAt(value.length -1) === '"') {
            value = value.substr(1,value.length- 2);
        }
        queryObj[parameter] = value;
    }

    // TODO: Parse selector syntax
    console.log(queryObj);
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