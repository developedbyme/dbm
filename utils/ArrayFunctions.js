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

export const numericArrayOrSeparatedString = function(aData, aSeparator = ",", aTrim = 3) {
    let returnArray = new Array();
    let currentArray = arrayOrSeparatedString(aData, aSeparator, aTrim);
    let currentarrayLength = currentArray.length;
    for(let i = 0; i < currentarrayLength; i++) {
        returnArray.push(parseFloat(currentArray[i]));
    }
    
    return returnArray;
}

export const filterByField = function(aArray, aField, aValue, aCompareFunction = "==") {

    if(!aArray) {
        return [];
    }

    let compareFunction;
    if(typeof(aCompareFunction) === "string") {
        compareFunction = Dbm.getInstance().repository.getItem("compareFunctions/" + aCompareFunction).compare;
        if(!compareFunction) {
            console.warn("No copmare function registered for: " + aCompareFunction + ". Using ==", aArray, aField, aValue);
            compareFunction = Dbm.utils.CompareFunctions.equals;
        }
    }
    else if(typeof(aCompareFunction) === "function") {
        compareFunction = aCompareFunction;
    }
    else {
        console.warn("Unkonown copmare function. Using ==", aCompareFunction, aArray, aField, aValue);
        compareFunction = Dbm.utils.CompareFunctions.equals;
    }
    

    let returnArray = [];

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentItem = aArray[i];
        let currentValue = Dbm.objectPath(aArray[i], aField);
        if(compareFunction(currentValue, aValue)) {
            returnArray.push(currentItem);
        }
    }

    return returnArray;
}

export const mapField = function(aArray, aField) {
   

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    let returnArray = new Array(currentArrayLength);
    for(let i = 0; i < currentArrayLength; i++) {
        returnArray[i] = Dbm.objectPath(aArray[i], aField);
    }

    return returnArray;
}

export const group = function(aArray, aField) {
   
    let groups = new Map();

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentObject = aArray[i];
        let groupValue = Dbm.objectPath(currentObject, aField);

        if(!groups.has(groupValue)) {
            groups.set(groupValue, []);
        }

        groups.get(groupValue).push(currentObject);
    }

    let returnArray = [];

    for (const value of groups.entries()) {
        returnArray.push({"key": value[0], "value": value[1]});
    }

    return returnArray;
}

export const groupOnMultipleFields = function(aArray, aFields, aSeparator = "-") {
   
    let groups = new Map();

    let currentArray2 = aFields;
    let currentArray2Length = currentArray2.length;

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentObject = aArray[i];
        let groupValues = [];
        
        for(let j = 0; j < currentArray2Length; j++) {
            groupValues.push(Dbm.objectPath(currentObject, currentArray2[j]));
        }
        let groupValue = groupValues.join(aSeparator);

        if(!groups.has(groupValue)) {
            groups.set(groupValue, []);
        }

        groups.get(groupValue).push(currentObject);
    }

    let returnArray = [];

    for (const value of groups.entries()) {
        returnArray.push({"key": value[0], "value": value[1]});
    }

    return returnArray;
}

export const makeFlat = function(aArray) {
    let returnArray = [];

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        returnArray = returnArray.concat(currentArray[i]);
    }

    return returnArray;
}

export const getUnselectedItems = function(aSelectedItems, aAllItems) {
    let returnItems = new Array();
    
    let currentArray = aAllItems;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentItem = currentArray[i];
        if(aSelectedItems.indexOf(currentItem) === -1) {
            returnItems.push(currentItem);
        }
    }
    
    return returnItems;
}

const defaultCompareFunction = function (aA, aB) {
    if(aA < aB) {
        return -1;
    }
    else if(aA > aB) {
        return 1;
    }

    return 0;
}

export const sortOnField = function(aArray, aField, aCompareFunction = null) {
    let compareFunction = aCompareFunction;
    if(!compareFunction) {
        compareFunction = defaultCompareFunction;
    }

    let sortFunction = function(aA, aB) {
        let aValue = Dbm.objectPath(aA, aField);
        let bValue = Dbm.objectPath(aB, aField);

        return compareFunction(aValue, bValue);
    }
    
    aArray.sort(sortFunction);
    
    return aArray;
}

export const sortOnNumericField = function(aArray, aField) {
    let compareFunction = function(aA, aB) {
        let aValue = 1*aA;
        let bValue = 1*aB;

        if(aValue < bValue) {
            return -1;
        }
        else if(aValue > bValue) {
            return 1;
        }

        return 0;
    }
    
    return sortOnField(aArray, aField, compareFunction);
}

export const naturalSortOnField = function(aArray, aField, aLanguageCode = null) {

    if(!aLanguageCode) {
        aLanguageCode = Dbm.getRepositoryItem("site").currentLanguageCode;
    }

    let compareObject = new Intl.Collator(aLanguageCode, { numeric: true, sensitivity: 'base' });

    let compareFunction = function(aA, aB) {
        if(!aA && !aB) return 0;
        if(!aA) return 1;
        if(!aB) return -1;

        let result = compareObject.compare(aA, aB);

        return result;
    }

    return sortOnField(aArray, aField, compareFunction)
}

export const getItemIndexByIfExists = function(aArray, aField, aIdentifier) {
		
    if(!Array.isArray(aArray)) {
        console.warn("No array provided", aArray);
        return -1;
    }
    
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentItem = currentArray[i];
        let currentValue = Dbm.objectPath(currentItem, aField);
        if(currentValue == aIdentifier) {
            return i;
        }
    }
    
    return -1;
}

export const getItemByIfExists = function(aArray, aField, aIdentifier) {
    let index = getItemIndexByIfExists(aArray, aField, aIdentifier);

    return (index !== -1) ? aArray[index] : null;
}

export const getItemBy = function(aArray, aField, aIdentifier) {
    let index = getItemIndexByIfExists(aArray, aField, aIdentifier);

    if(index === -1) {
        console.warn("No item found", aArray, aField, aIdentifier);
    }

    return (index !== -1) ? aArray[index] : null;
}

export const sum = function(aArray) {
		
    if(!Array.isArray(aArray)) {
        console.warn("No array provided", aArray);
        return 0;
    }
    
    let sum = 0;
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentValue = 1*currentArray[i];
        if(!isNaN(currentValue)) {
            sum += currentValue;
        }
    }
    
    return sum;
}

export const stepFromCenter = function(aStep, aLength) {
    let halfPoint = (aLength-1)/2;
    let startIndex = Math.ceil(halfPoint);
    let direction = (startIndex > halfPoint) ? -1 : 1;

    let step = Math.ceil(aStep/2);
    let swing = (aStep%2)*2-1;
    let index = startIndex + step * (swing * direction);

    return index;
}

export const scoreItems = function(aArray, aScoreFunction) {
    let returnArray = [];

    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let item = currentArray[i];
        returnArray.push({"key": item, "value": aScoreFunction(item)});
    }

    sortOnField(returnArray, "value");

    return returnArray;
}

export const splitArray = function(aArray, aGroupSize) {
    let returnArray = [];
    let currentGroup = null;
    
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        if(i % aGroupSize === 0) {
            currentGroup = [];
            returnArray.push(currentGroup);
        }
        currentGroup.push(currentArray[i]);
    }
    
    return returnArray;
}

export const mapArrayToObject = function(aArray, aKeyField, aDataField = null, aKeyPrefix = "") {
		
    let returnObject = {};
    
    let currentArray = aArray;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        let currentArrayEntry = currentArray[i];
        let key = aKeyPrefix + Dbm.objectPath(currentArrayEntry, aKeyField);
        let data = aDataField ? Dbm.objectPath(currentArrayEntry, aDataField) : currentArrayEntry;
        
        returnObject[key] = data;
    }
    
    return returnObject;
}
	
export const mapObjectToArray = function(aObject, aKeyField, aDataField = null, aKeyPrefix = "") {
    let returnArray = [];
    
    for(let objectName in aObject) {
        let currentEntry = aObject[objectName];
        let newObject = {};
        
        if(aDataField !== null) {
            newObject[aDataField] = currentEntry;
        }
        else {
            for(let objectName2 in currentEntry) {
                newObject[objectName2] = currentEntry[objectName2];
            }
        }
        if(aKeyField) {
            newObject[aKeyField] = objectName.substring(aKeyPrefix.length, objectName.length);
        }
        
        returnArray.push(newObject);
    }
    
    return returnArray;
}
	
export const mapObjectToArrayWithoutKey = function(aObject) {
    let returnArray = [];
    
    for(let objectName in aObject) {
        returnArray.push(aObject[objectName]);
    }
    
    return returnArray;
}

export const anyOverlap = function(aArray1, aArray2) {
    let currentArray = aArray1;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        if(aArray2.indexOf(currentArray[i]) !== -1) {
            return true;
        }
    }

    return false;
}