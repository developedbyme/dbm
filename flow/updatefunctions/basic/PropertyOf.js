import Dbm from "../../../index.js";

export default class PropertyOf extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", "");
        this.input.register("propertyName", "");

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;
        
        this.output.value = Dbm.objectPath(value, this.input.propertyName);
    }
}