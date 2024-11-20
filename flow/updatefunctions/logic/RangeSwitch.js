import Dbm from "../../../index.js";

export default class RangeSwitch extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", 0);
        this.input.register("defaultValue", null);
        this.input.register("ranges", []);

        this.output.register("value", null);
    }

    addValueForRange(aOutputValue, aMinInputValue = null, aMaxInputValue = null) {

        let rangeData = {value: aOutputValue, min: aMinInputValue, max: aMaxInputValue};

        let newRanges = [].concat(this.input.ranges);

        newRanges.push(rangeData);

        this.input.ranges = newRanges;

        return this;
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let currentArray = this.input.ranges;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentRange = currentArray[i];

            if((value >= currentRange["min"] || currentRange["min"] === null) && (value < currentRange["max"] || currentRange["max"] === null)) {
                this.output.value = currentRange["value"];
                return;
            }
        }

        this.output.value = this.input.defaultValue;
    }
}