import Dbm from "../index.js";

export const convertPropertiesToArray = function(aObject, aPropertyNames) {
		
    let returnArray = new Array();
    
    let currentArray = aPropertyNames;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        returnArray.push(aObject[currentArray[i]]);
    }
    
    return returnArray;
}