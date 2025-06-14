import Dbm from "../../index.js";

export default class SourceBaseObject extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._log = false;
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

        if(this._log) {
            console.log("Source>>>>>", baseObject, path);
            let currentPath = "";
            let currentArray = path.split(".");
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                currentPath += currentArray[i];
                console.log(currentPath, Dbm.objectPath(baseObject, currentPath));
                currentPath += ".";
            }
        }

		if(!path) {
			return baseObject;
		}
        
        return Dbm.objectPath(baseObject, path);
    }

    addLogs() {
        this._log = true;
        return this;
    }
}