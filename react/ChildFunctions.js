import Dbm from "../index.js";

export const splitIntoSlots = function(aChildren) {
    let returnObject = {};

    aChildren = Dbm.utils.ArrayFunctions.singleOrArray(aChildren);

    if(aChildren) {
        let currentArray = aChildren;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentElement = currentArray[i];
            let currentSlot = Dbm.objectPath(currentElement, "props.data-slot");
            if(!currentSlot) {
                currentSlot = "main";
            }
            let currentArea = returnObject[currentSlot];
            if(!currentArea) {
                returnObject[currentSlot] = currentArea = [];
            }
            currentArea.push(currentElement);
        }
    }
    

    return returnObject;
}