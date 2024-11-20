import Dbm from "../../../index.js";

export {default as Addition} from "./Addition.js";
export {default as Multiplication} from "./Multiplication.js";
export {default as RangeSwitch} from "./RangeSwitch.js";
export {default as Subtraction} from "./Subtraction.js";

export let subtract = function(aInput1 = 0, aInput2 = 0) {
    let updateFunction = new Dbm.flow.updatefunctions.logic.Subtraction();
    updateFunction.input.properties.input1.setOrConnect(aInput1);
    updateFunction.input.properties.input2.setOrConnect(aInput2);

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