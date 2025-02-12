import Dbm from "../../../index.js";

export default class Length extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", "");

        this.output.register("length", 0);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;
        
        this.output.length = value ? value.length : 0;
    }
}