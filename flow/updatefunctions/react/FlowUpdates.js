import Dbm from "../../../index.js";

export default class FlowUpdates extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("owner", null);

        this.output.register("dynamicUpdate", 0);
    }

    _update() {
        //console.log("UpdateState::_update");

        let dynamicUpdate = this.input.owner.state.dynamicUpdate;
        dynamicUpdate++;
        this.input.owner.updateSources();

        this.output.dynamicUpdate = dynamicUpdate;
    }
}