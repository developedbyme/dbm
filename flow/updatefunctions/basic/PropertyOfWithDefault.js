import Dbm from "../../../index.js";

export default class PropertyOfWithDefault extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", "");
        this.input.register("propertyName", "");
        this.input.register("defaultValue", null);

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let outputValue = Dbm.objectPath(value, this.input.propertyName);

        if(!outputValue) {
            outputValue = this.input.defaultValue;
        }
        
        this.output.value = outputValue
    }
}