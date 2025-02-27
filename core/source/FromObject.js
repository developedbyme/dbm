import Dbm from "../../index.js";

export default class FromObject extends Dbm.core.source.SourceBaseObject {
	
	getBaseObject(aFromObject, aEventData) {
		return aFromObject;
	}
}