import Dbm from "../index.js";

export default class DirtyCommands extends Dbm.flow.FlowBaseObject {

    _constructProperties() {
        super._constructProperties();

        this.commands = [];
        this._upstreamConnection = null;
    }

    get isDirty() {
        return false;
    }

    set isDirty(aValue) {
        if(aValue) {
            let currentArray = this.commands;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentCommand = currentArray[i];
                currentCommand.perform(this, null);
            }
        }
    }

    _connection_connectUpstream(aFlowObject) {
        if(this._upstreamConnection) {
            //METODO: disconnect old input

        }

        this._upstreamConnection = aFlowObject;
    }

    destroy() {
        super.destroy();

        this.commands = [];
        if(this._upstreamConnection) {
            //METODO: remove as outgoing
            this._upstreamConnection = null;
        }
    }
}