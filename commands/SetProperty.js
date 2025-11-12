import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class SetProperty extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("property", null);
        this.item.setValue("value", null);
    }

    perform(aFromObject, aData) {
		
        let value = this.getInputFrom("value", aFromObject, aData);
        
        this._resolveSourceWithoutFlow(this.item.property, aFromObject, aData).getMostUpstreamProperty().value = value;
    }
}