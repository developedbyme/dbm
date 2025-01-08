import Dbm from "../../index.js";

export {default as ContextVariableSource} from "./ContextVariableSource.js";

export let contextVariable = function(aPath) {
    let newSource = new Dbm.react.source.ContextVariableSource();
    newSource.item.path = aPath;

    return newSource;
}

export let blockData = function(aPath) {
    //METODO: check if blockdata is a source
    return contextVariable("blockData." + aPath);
}