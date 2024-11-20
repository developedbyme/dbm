import Dbm from "../index.js";

export default class FlowBaseObject extends Dbm.core.LifeCycleObject {

    _constructProperties() {
        super._constructProperties();

        this._downstreamConnections = [];
        this.isDirty = false;
    }

    connectInput(aFlowObject) {
        this._connection_connectUpstream(aFlowObject);
        aFlowObject._connection_connectDownstream(this);

        return this;
    }

    _connection_connectUpstream(aFlowObject) {
        //MENOTE: should be overridden
    }

    connectOutput(aFlowObject) {
        aFlowObject._connection_connectUpstream(this);
        this._connection_connectDownstream(aFlowObject);

        return this;
    }

    _connection_connectDownstream(aFlowObject) {
        this._downstreamConnections.push(aFlowObject);
        aFlowObject.setAsDirty();
    }

    _internal_updateFlow() {
        //MENOTE: should be overridden
    }

    _internal_setValueInFlow(aValue) {
        
    }

    setAsDirty() {
        this.isDirty = true;
        this.setDownstreamAsDirty();

        return this;
    }

    setDownstreamAsDirty() {
        //console.log("setDownstreamAsDirty");
        //console.log(this);

        let currentArray = [];
        this.collectAndMarkDownstreamConnectionsAsDirty(currentArray);
        for(let i = 0; i < currentArray.length; i++) { //MENOTE: length increases in the loop
            let currentFlowObject = currentArray[i];
            //console.log(currentFlowObject);
            currentFlowObject.collectAndMarkDownstreamConnectionsAsDirty(currentArray);
        }

        return this;
    }

    collectAndMarkDownstreamConnectionsAsDirty(aReturnArray) {
        //console.log("collectAndMarkDownstreamConnectionsAsDirty");

        let currentArray = this._downstreamConnections;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentConenction = currentArray[i];
            if(!currentConenction.isDirty) {
                currentConenction.isDirty = true;
                aReturnArray.push(currentConenction);
            }
        }
    }
}