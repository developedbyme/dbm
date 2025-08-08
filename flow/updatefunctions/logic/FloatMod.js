import Dbm from "../../../index.js";

export default class FloatMod extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("input", 0);
        this.input.register("min", 0);
        this.input.register("max", 1);

        this.output.register("result", 0);
    }

    _update() {
        //console.log("_update");

        let relativeValue = this.input.input-this.input.min;
        let length = this.input.max-this.input.min;

        let times = Math.floor(relativeValue/length);
        let clampledValue = relativeValue-(length*times);

        this.output.result = this.input.min+clampledValue;
    }
}