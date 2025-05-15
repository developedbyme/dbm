import Dbm from "../../../index.js";

export default class TransformStyle extends Dbm.flow.updatefunctions.basic.CombineString {

    _construct() {
        super._construct();
        
        this.stringCombiners = []; 
        this.input.delimeter = " ";
    }

    addSingleValueOperation(aOperation, aValue, aUnit = "") {
        let newCombineString = new Dbm.flow.updatefunctions.basic.CombineString();
        newCombineString.addParts(aOperation, "(", aValue, aUnit, ")");
        this.stringCombiners.push(newCombineString);

        this.addPart(newCombineString.output.properties.value);
    }

    addDoubleValueOperation(aOperation, aValue1, aUnit1 = "", aValue2, aUnit2 = "") {
        let newCombineString = new Dbm.flow.updatefunctions.basic.CombineString();
        newCombineString.addParts(aOperation, "(", aValue1, aUnit1, ", ", aValue2, aUnit2, ")");
        this.stringCombiners.push(newCombineString);

        this.addPart(newCombineString.output.properties.value);
    }

    translate(aValue1, aUnit1 = "px", aValue2, aUnit2 = "px") {
        this.addDoubleValueOperation("translate", aValue1, aUnit1, aValue2, aUnit2);
    }

    translateX(aValue, aUnit = "px") {
        this.addSingleValueOperation("translateX", aValue, aUnit);
    }

    translateY(aValue, aUnit = "px") {
        this.addSingleValueOperation("translateY", aValue, aUnit);
    }

    uniformScale(aValue, aUnit = "") {
        this.addDoubleValueOperation("scale", aValue, aUnit, aValue, aUnit);
    }

    rotate(aValue, aUnit = "deg") {
        this.addSingleValueOperation("rotate", aValue, aUnit);
    }

    perspective(aValue, aUnit = "px") {
        this.addSingleValueOperation("perspective", aValue, aUnit);
    }
}