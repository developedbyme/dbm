import Dbm from "../index.js";

export default class CommandBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    perform(aFromObject, aData) {
        //MENOTE: should be overridden
    }

    _resolveSource(aValueOrSource, aFromObject = null, aData = null) {
        if(aValueOrSource) {
            if(aValueOrSource.isFlowProperty) {
                return aValueOrSource.value;
            }
            else if(aValueOrSource.isSource) {
                return aValueOrSource.getSource(aFromObject, aData);
            }
        }

        return aValueOrSource;
    }

    _resolveSourceWithoutFlow(aValueOrSource, aFromObject = null, aData = null) {
        if(aValueOrSource && aValueOrSource.isSource) {
            return aValueOrSource.getSource(aFromObject, aData);
        }

        return aValueOrSource;
    }

    getInput(aName) {
        return this._resolveSource(this.item[aName]);
    }

    getInputFrom(aName, aFromObject = null, aData = null) {
        return this._resolveSource(this.item[aName], aFromObject, aData);
    }
}