import Dbm from "../../../index.js";

export {default as Addition} from "./Addition.js";
export {default as Multiplication} from "./Multiplication.js";
export {default as RangeSwitch} from "./RangeSwitch.js";
export {default as Subtraction} from "./Subtraction.js";
export {default as Switch} from "./Switch.js";
export {default as Condition} from "./Condition.js";
export {default as All} from "./All.js";
export {default as Any} from "./Any.js";
export {default as AllAtValue} from "./AllAtValue.js";
export {default as WhenMatched} from "./WhenMatched.js";
export {default as Invert} from "./Invert.js";
export {default as PositionedItems} from "./PositionedItems.js";
export {default as FloatMod} from "./FloatMod.js";

export let subtract = function(aInput1 = 0, aInput2 = 0) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Subtraction();
    updateFunction.input.properties.input1.setOrConnect(aInput1);
    updateFunction.input.properties.input2.setOrConnect(aInput2);

    return updateFunction;
}

export let invert = function(aValue = false) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Invert();
    updateFunction.input.properties.input.setValue(aValue);

    return updateFunction;
}

export let invertP = function(aP = 0) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Subtraction();
    updateFunction.input.properties.input1.setValue(1);
    updateFunction.input.properties.input2.setOrConnect(aP);

    return updateFunction;
}

export let add = function(aInput1 = 0, aInput2 = 0) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Addition();
    updateFunction.input.properties.input1.setOrConnect(aInput1);
    updateFunction.input.properties.input2.setOrConnect(aInput2);

    return updateFunction;
}

export let multiply = function(aInput1 = 1, aInput2 = 1) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Multiplication();
    updateFunction.input.properties.input1.setOrConnect(aInput1);
    updateFunction.input.properties.input2.setOrConnect(aInput2);

    return updateFunction;
}

export let condition = function(aInput1 = null, aOperationFunction = null, aInput2 = null) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Condition();
    updateFunction.input.properties.input1.setOrConnect(aInput1);
    updateFunction.input.properties.operation.setOrConnect(aOperationFunction);
    updateFunction.input.properties.input2.setOrConnect(aInput2);

    return updateFunction;
}

export let all = function(...aValues) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.All();
    
    let currentArray = aValues;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        updateFunction.addCheck(currentArray[i]);
    }

    return updateFunction;
}

export let any = function(...aValues) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Any();
    
    let currentArray = aValues;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        updateFunction.addCheck(currentArray[i]);
    }

    return updateFunction;
}

export let allAtValue = function(aMatchValue, ...aValues) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.AllAtValue();

    updateFunction.input.matchValue = aMatchValue;
    
    let currentArray = aValues;
    let currentArrayLength = currentArray.length;
    for(let i = 0; i < currentArrayLength; i++) {
        updateFunction.addCheck(currentArray[i]);
    }

    return updateFunction;
}

export let whenMatched = function(aValue, aMatchValue = true) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.WhenMatched();
    updateFunction.input.properties.value.setOrConnect(aValue);
    updateFunction.input.properties.matchValue.setOrConnect(aMatchValue);

    return updateFunction;
}

export let switchValue = function(aValue = null) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Switch();
    updateFunction.input.properties.value.setOrConnect(aValue);
	
	return updateFunction;
}

export let floatMod = function(aValue = null, aMax = 1) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.FloatMod();
    updateFunction.input.properties.input.setOrConnect(aValue);
    updateFunction.input.properties.max.setOrConnect(aMax);
	
	return updateFunction;
}

export let floatModRange = function(aValue = null, aMin = 0, aMax = 1) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.FloatMod();
    updateFunction.input.properties.input.setOrConnect(aValue);
    updateFunction.input.properties.min.setOrConnect(aMin);
    updateFunction.input.properties.max.setOrConnect(aMax);
	
	return updateFunction;
}