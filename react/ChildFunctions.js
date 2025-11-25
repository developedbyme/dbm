import Dbm from "../index.js";
import React from "react";

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

export const clone = function(aChild, aProps) {
        
        if(aChild instanceof Array) {
            let returnArray = [];
            
            let currentArray = aChild;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentChild = currentArray[i];
                returnArray.push(clone(currentChild, aProps));
            }
            
            return returnArray;
        }
        
        let newProps = aProps;

        if(aChild && aChild.props && aChild.props.className) {
            newProps = {...aProps};
            
            if(aProps.className) {
                newProps.className = aProps.className + " " + aChild.props.className;
            } 
            else {
                newProps.className = aChild.props.className;
            }
        }

        //METODO: combine styles
        //METODO: combine listeners
        
        let callArray = [aChild, newProps];
        
        if(aChild && aChild.props) {
            let firstChildChildren = aChild.props.children;
            if(!firstChildChildren) {
                //MENOTE: do nothing
            }
            else if(firstChildChildren instanceof Array) {
                callArray = callArray.concat(firstChildChildren);
            }
            else {
                callArray.push(firstChildChildren);
            }
        }
        
        return React.cloneElement.apply(React, callArray);
    }