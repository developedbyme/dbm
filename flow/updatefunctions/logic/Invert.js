import Dbm from "../../../index.js";

export default class Invert extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("input", false);

        this.output.register("result", true);
    }

    _update() {
        //console.log("_update");

        this.output.result = !this.input.input;
    }
}