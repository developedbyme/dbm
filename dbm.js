import {GlobalObject} from "./core/index.js";

if(!globalThis.dbm) {
    globalThis.dbm = new GlobalObject();
}

export let getInstance = function() {
    return globalThis.dbm;
}

//export {getInstance};

export let objectPath = function(aObject, aPath) {
    //console.log("objectPath");
    
    let currentObject = aObject;
    
    aPath += "";
    if(aPath.length === 0) {
        return currentObject;
    }
    
    let currentArray = aPath.split(".");
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentPathPart = currentArray[0];
        
        if(currentObject === null || currentObject === undefined) {
            break;
        }

        /*
        else if(currentPathPart === "(every)") {
            currentArray.shift();
            let currentItems = Wprr.utils.array.singleOrArray(currentObject);
            let returnArray = Wprr.utils.array.mapField(currentItems, currentArray.join("."));
            return returnArray;
        }
        */
        
        if(currentPathPart === "(self)") {
            continue;
        }
        else {
            currentArray.shift();
            
            let partAsInt = parseInt(currentPathPart, 10);
            if(partAsInt.toString() === currentPathPart) {
                currentObject = currentObject[partAsInt];
            }
            else {
                currentObject = currentObject[currentPathPart];
            }
        }
    }
    
    return currentObject;
}

export let setAtObjectPath = function(aObject, aPath, aValue) {
    aPath += "";
    if(aPath.length === 0) {
        return 0;
    }

    let baseObject = aObject;
    let propertyName = aPath;

    let paths = aPath.split(".");
    if(paths.length > 1) {
        propertyName = paths.pop();

        baseObject = objectPath(baseObject, paths.join("."));
    }

    if(baseObject) {
        let partAsInt = parseInt(propertyName, 10);
        if(partAsInt.toString() === propertyName) {
            propertyName = partAsInt;
        }
        baseObject[propertyName] = aValue;
    }
}

export * as utils from "./utils/index.js";
export * as core from "./core/index.js";
export * as loading from "./loading/index.js";
export * as react from "./react/index.js";
export * as repository from "./repository/index.js";
export * as graphapi from "./graphapi/index.js";
export * as commands from "./commands/index.js";
export * as flow from "./flow/index.js";
export * as updater from "./updater/index.js";
export * as startup from "./startup/index.js";
export * as site from "./site/index.js";
export * as tracking from "./tracking/index.js";
export * as ecommerce from "./ecommerce/index.js";