import Dbm from "../../../index.js";

export default class GetItemBy extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", null);
        this.input.register("items", []);
        this.input.register("path", "id");

        this.output.register("value", null);
    }

    _update() {
        //console.log("GetItemBy::_update");
        
        this.output.value = Dbm.utils.ArrayFunctions.getItemBy(this.input.items, this.input.path, this.input.value);
    }
}