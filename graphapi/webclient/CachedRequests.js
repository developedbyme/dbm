import Dbm from "../../index.js";

export default class CachedRequests extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._ranges = {};
        this._items = {};
        this._data = {};
    }

    _getRangeIdentifier(aSelect, aEncode) {
        let selects = [];
        let paramters = [];

        {
            let currentArray = aSelect;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentSelect = currentArray[i];
                selects.push(currentSelect.type);

                for(let objectName in currentSelect) {
                    if(objectName !== "type") {
                        paramters.push(objectName + "=" + encodeURIComponent(currentSelect[objectName]));
                    }
                }
            }
        }

        selects.sort();
        paramters.sort();

        let returnString = selects.join(",") + "/" + this._getEncodeIdentifier(aEncode) + "?" + paramters.join("&");

        return returnString;
    }

    _getEncodeIdentifier(aEncode) {
        let encodes = [].concat(aEncode).sort();
        return encodes.join(",");
    }
	
	requestRange(aSelect, aEncode) {
        console.log("requestRange");

        let id = this._getRangeIdentifier(aSelect, aEncode);
        console.log(id);

        if(this._ranges[id]) {
            return this._ranges[id];
        }

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        let request = graphApi.requestRange(aSelect, aEncode);

        this._ranges[id] = request;
        return request;
    }

    requestItem(aId, aEncode) {
        console.log("requestItem");

        let id = aId + "/" + this._getEncodeIdentifier(aEncode);
        console.log(id);

        if(this._items[id]) {
            return this._items[id];
        }

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        let request = graphApi.requestItem(aId, aEncode);

        this._items[id] = request;
        return request;
    }

    requestData(aFunctionName, aData) {
        let paramters = [];
        for(let objectName in aData) {
            if(objectName !== "type") {
                paramters.push(objectName + "=" + encodeURIComponent(aData[objectName]));
            }
        }

        paramters.sort();

        let id = aFunctionName + "?" + paramters.join("&");
        console.log(">>>>>>>>>", id);

        if(this._data[id]) {
            return this._data[id];
        }

        let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;
        let request = graphApi.requestData(aFunctionName, aData);

        this._data[id] = request;
        return request;
    }

	requestUrl(aUrl) {
		//console.log("requestUrl");
		//console.log(aUrl);
		
	}
}