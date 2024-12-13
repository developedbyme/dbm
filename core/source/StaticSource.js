import Dbm from "../../index.js";

export default class StaticSoruce extends Dbm.core.source.SourceBaseObject {
	
    _construct() {
        super._construct();

        this.item.setValue("object", null);
    }
	
	getBaseObject(aFromObject, aEventData) {
		return this.item.object;
	}
}