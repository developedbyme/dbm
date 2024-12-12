import Dbm from "../../../index.js";

export default class WhenMatched extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("value", null);
        this.input.register("matchValue", true);

        this.output.register("value", false);
    }

    _update() {
        //console.log("_update");

        if(this.input.value === this.input.matchValue) {
            this.output.value = true;
        }
		else {
			this.output.properties.value.isDirty = false;
		}
    }
}