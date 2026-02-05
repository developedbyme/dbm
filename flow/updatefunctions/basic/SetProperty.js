import Dbm from "../../../index.js";

export default class SetProperty extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", "");
        this.input.register("object", null);
        this.input.register("propertyName", null);

        this.output.register("value", null);
    }

    _update() {
        //console.log("_update");

        let value = this.input.value;

        let propertyName = this.input.propertyName;
        let object = this.input.object;

        if(propertyName && object) {
            Dbm.setAtObjectPath(object, propertyName, value);
        }
        
        
        this.output.value = value;
    }
}