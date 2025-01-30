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