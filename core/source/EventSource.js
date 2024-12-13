import Dbm from "../../index.js";

export default class EventSource extends Dbm.core.source.SourceBaseObject {
	
	getBaseObject(aFromObject, aEventData) {
		return aEventData;
	}
}