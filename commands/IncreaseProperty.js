import Dbm from "../index.js";
import CommandBaseObject from "./CommandBaseObject.js"

export default class IncreaseProperty extends CommandBaseObject {
    _construct() {
        super._construct();

        this.item.setValue("property", null);
        this.item.setValue("value", 1);
    }

    perform(aFromObject, aData) {
		
        let value = this.getInputFrom("value", aFromObject, aData);
        
        let property = this._resolveSourceWithoutFlow(this.item.property, aFromObject, aData);
        property.getMostUpstreamProperty().value = property.value + value;
    }
}