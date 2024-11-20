import Dbm from "../../../index.js";

export default class Multiplication extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("input1", 0);
        this.input.register("input2", 0);

        this.output.register("result", 0);
    }

    _update() {
        //console.log("_update");

        this.output.result = this.input.input1 * this.input.input2;
    }
}