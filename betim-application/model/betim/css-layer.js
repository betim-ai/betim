export default class CSSLayer {

    /**
     * Decode Abstract Syntax Tree and generate CSS code.
     * @param ast CSS abstract syntaxt tree
     */
    decodeAST(ast){
        let cssSnippet="";
        
        // Get selector and declaration blocks.
        let selectorGroup = ast[0].selectorGroup;
        let declarationBlock = ast[0].declarationBlock;
    
        // Check AST format.
        if (!selectorGroup || !declarationBlock) {
            console.error("Malformed ast object.");
            return undefined;
        }
        
        // Decode selector group
        for (let i=0; i<selectorGroup.length; i++) {
            cssSnippet += selectorGroup[i].name;
            
            if (i != selectorGroup.length - 1)
                cssSnippet += ", "
        }
    
        cssSnippet += " {\n"
        // Build statement block
        for (let i=0; i<declarationBlock.length; i++) {
            let declaration = declarationBlock[i];
            cssSnippet += `\t${declaration.property}: ${declaration.value} !important;\n`
        }
    
        cssSnippet += "}"
    
        return cssSnippet;
    }
}