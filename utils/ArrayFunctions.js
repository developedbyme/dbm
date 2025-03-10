import Dbm from "../index.js";

export const range = function(aStartValue, aEndValue, aStepValue = 1, aIncludeEndValue = true) {
		
    let returnArray = new Array();
    
    let loopCompare;
     
    if(aStepValue > 0) {
        if(aIncludeEndValue) {
            loopCompare = function(aIndex, aLimit) {
                return aIndex <= aLimit;
            };
        }
        else {
            loopCompare = function(aIndex, aLimit) {
                return aIndex < aLimit;
            };
        }
    }
    else {
        if(aIncludeEndValue) {
            loopCompare = function(aIndex, aLimit) {
                return aIndex >= aLimit;
            };
        }
        else {
            loopCompare = function(aIndex, aLimit) {
                return aIndex > aLimit;
            };
        }
    }
    
    for(let i = aStartValue; loopCompare(i, aEndValue); i += aStepValue) {
        returnArray.push(i);
    }
    
    return returnArray;
}

export const removeDuplicates = function(aArray) {
    let returnArray = [];
		
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentValue = currentArray[i];
        if(returnArray.indexOf(currentValue) === -1) {
            returnArray.push(currentValue);
        }
    }
    
    return returnArray;
}

export const singleOrArray = function(aData) {
    if(aData === null || aData === undefined) {
        return [];
    }
    else if(aData instanceof Array) {
        return aData;
    }
    
    return [aData];
}

export const removeValues = function(aArray, aRemoveValues) {
    let returnArray = new Array();
    
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentValue = currentArray[i];
        if(aRemoveValues.indexOf(currentValue) === -1) {
            returnArray.push(currentValue);
        }
    }
    
    return returnArray;
}

export const trimArray = function(aArray, aMode = 3) {
		
    if(aMode > 0) {
        //METODO: use mode
        if(aArray) {
            let currentArray = aArray;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentString = currentArray[i];
                
                if(typeof(currentString) === "string") {
                    currentArray[i] = currentString.trim();
                }
            }
        }
    }
    
    return aArray;
}

export const arrayOrSeparatedString = function(aData, aSeparator = ",", aTrim = 3) {
    if(aData === null || aData === undefined) {
        return [];
    }
    else if(aData instanceof Array) {
        return aData;
    }
    else if(typeof(aData) === "string") {
        if(aData === "") {
            return [];
        }
        return trimArray(aData.split(aSeparator));
    }
    
    console.error(aData + " is not array or string.");
    return [];
}

export const filterByField = function(aArray, aField, aValue) {
    let returnArray = [];

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentItem = aArray[i];
        let currentValue = Dbm.objectPath(aArray[i], aField);
        if(currentValue === aValue) {
            returnArray.push(currentItem);
        }
    }

    return returnArray;
}

export const mapField = function(aArray, aField) {
   

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    let returnArray = new Array(acurrentArrayLength);
    for(let i = 0; i < currentArrayLength; i++) {
        returnArray[i] = Dbm.objectPath(aArray[i], aField);
    }

    return returnArray;
}