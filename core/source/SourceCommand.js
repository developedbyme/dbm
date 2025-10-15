import Dbm from "../../index.js";

export default class SourceCommand extends Dbm.core.source.SourceBaseObject {
	
    _construct() {
        super._construct();

        this.item.setValue("object", null);
    }
	
	getBaseObject(aFromObject, aEventData) {

        let command = this.item.object;

		return command.perform(aFromObject, aEventData);
	}
}