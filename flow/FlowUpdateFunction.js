import Dbm from "../index.js";

export default class FlowUpdateFunction extends Dbm.flow.FlowBaseObject {

    _constructProperties() {
        super._constructProperties();
        
        this._upstreamConnections = [];
        this.input = (new Dbm.flow.UpdateFunctionInputs()).setOwner(this);
        this.output = (new Dbm.flow.UpdateFunctionOutputs()).setOwner(this);
    }

    _connection_connectUpstream(aFlowObject) {
        this._upstreamConnections.push(aFlowObject);
    }

    _internal_updateFlow() {
        //console.log("_internal_updateFlow");
        
        let shouldUpdate = this.input.updateValues();

        try {
            if(shouldUpdate) {
                this._update();
            }
            else {
                this.output.markAsClean();
            }
            this.isDirty = false;
        }
        catch(theError) {
            console.error(theError);
        }
    }

    _update() {
        //MENOTE: should be overridden
    }
}