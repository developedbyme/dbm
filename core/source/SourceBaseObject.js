import Dbm from "../../index.js";

export default class SourceBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.setValue("path", null);
    }

    get isSource() {
        return true;
    }
	
	getBaseObject(aFromObject, aEventData) {
		return null;
	}

    getSource(aFromObject, aEventData = null) {
        //console.log("getSource");
		
		let path = this.item.path;
		let baseObject = this.getBaseObject(aFromObject, aEventData);
		if(!path) {
			return baseObject;
		}
        
        return Dbm.objectPath(baseObject, path);
    }
}