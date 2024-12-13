import Dbm from "../../index.js";

export default class SourceBaseObject extends Dbm.core.source.SourceBaseObject {
	
	getBaseObject(aFromObject, aEventData) {
		return aFromObject.context;
	}
}