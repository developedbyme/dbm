import Dbm from "../../index.js";

export {default as ContextVariableSource} from "./ContextVariableSource.js";

export const contextVariable = function(aPath) {
    let newSource = new Dbm.react.source.ContextVariableSource();
    newSource.item.path = aPath;

    return newSource;
}

export const item = function(aPath = null) {
    let fullPath = "item";
    if(aPath) {
        fullPath += "." + aPath;
    }
    return contextVariable(fullPath);
}

export const blockData = function(aPath) {
    //METODO: check if blockdata is a source
    return contextVariable("blockData." + aPath);
}