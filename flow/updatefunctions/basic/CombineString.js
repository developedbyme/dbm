import Dbm from "../../../index.js";

export default class CombineString extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("parts", []);
        this.input.register("delimiter", "");

        this.output.register("value", "");
    }

    addPart(aValue) {
        let part = this.input.register("part_" + this.input.parts.length, null).setOrConnect(aValue);

        this.input.parts.push(part);

        return this;
    }

    addParts(...aParts) {
        let currentArray = aParts;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            this.addPart(currentArray[i]);
        }

        return this;
    }

    _update() {
        //console.log("_update");

        let currentArray = this.input.parts;
        let currentArrayLength = currentArray.length;

        let returnArray = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            returnArray[i] = currentArray[i].value;
        }

        this.output.value = returnArray.join(this.input.delimiter);
    }
}