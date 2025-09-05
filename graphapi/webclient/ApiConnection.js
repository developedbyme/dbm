import Dbm from "../../index.js";

export default class ApiConnection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._url = null;
		this._setupItemResponseBound = this._setupItemResponse.bind(this);
        this._setupItemsResponseBound = this._setupItemsResponse.bind(this);
        this._setupDataResponseBound = this._setupDataResponse.bind(this);
    }

    setup(aUrl) {
		
        this._url = aUrl;
		
		return this;
    }

    _getRequestItem() {

        let request = new Dbm.graphapi.webclient.ApiRequest();
        request.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
        request.item.setValue("connection", this.item); 

        return request.item;
    }

    requestRange(aSelect, aEncode) {
        let item = this._getRequestItem();
        item.requireProperty("items", []);

        let selectArray = [];
        let encodeString = aEncode.join(",");
        let parametersArray = [];

        {
            let currentArray = aSelect;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let currentSelect = currentArray[i];
                selectArray.push(currentSelect.type);

                for(let objectName in currentSelect) {
                    if(objectName !== "type") {
                        parametersArray.push(objectName + "=" + encodeURIComponent(currentSelect[objectName]));
                    }
                }
            }
        }
        
        let fullUrl = this._url + "range/" + selectArray.join(",") + "/" + encodeString + "?" + parametersArray.join("&");
		fetch(fullUrl).then((aRequest) => {
			return aRequest.json();
		}).then((aData) => {
			this._setupItemsResponseBound(item, aData);
		});
        
        return item;
    }

    requestItem(aId, aEncode) {
        let item = this._getRequestItem();
        item.requireProperty("item", null);
        
        let encodeString = aEncode.join(",");

        let fullUrl = this._url + "item/" + aId + "/" + encodeString;
		fetch(fullUrl).then((aRequest) => {
			return aRequest.json();
		}).then((aData) => {
			this._setupItemResponseBound(item, aData);
		});
        
        return item;
    }

    requestData(aFunctionName, aData) {
        let item = this._getRequestItem();

        let parametersArray = [];

        for(let objectName in aData) {
            if(objectName !== "type") {
                parametersArray.push(objectName + "=" + encodeURIComponent(aData[objectName]));
            }
        }
        
        let fullUrl = this._url + "data/" + aFunctionName + "?" + parametersArray.join("&");
		fetch(fullUrl).then((aRequest) => {
			return aRequest.json();
		}).then((aData) => {
			this._setupDataResponseBound(item, aData);
		});
        
        return item;
    }

    //METODO: action

    createItem(aTypes, aVisibility = "draft", aChanges = [], aEncode = []) {
        let item = this._getRequestItem();
        

        return item;
    }

    editItem(aId, aChanges, aEncode = []) {
        let item = this._getRequestItem();
        

        return item;
    }
	
	_updateObjects(aObjects) {
		let repository = Dbm.getInstance().repository;
		
		let currentArray = aObjects;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let data = currentArray[i];
            let item = repository.getItem(data["id"]);
            let decoder = repository.getItemIfExists("graphApi/decode/" + data["encoding"]);
            if(decoder) {
                decoder.controller.updateItemWithEncoding(item, data["data"]);
            }
            else {
                console.warn("No decoder for " + data["encoding"]);
            }
		}
	}

    _setupItemsResponse(aRequestItem, aData) {
		this._updateObjects(aData.objects);
		
		let repository = Dbm.getInstance().repository;
		
		let ids = aData.data.ids;
		if(ids) {
			aRequestItem.setValue("items", repository.getItems(ids));
		}
		else {
			aRequestItem.setValue("items", []);
		}
		
		aRequestItem.status = 1;
	}
	
	_setupItemResponse(aRequestItem, aData) {
		this._updateObjects(aData.objects);
		
		let repository = Dbm.getInstance().repository;
		
		let id = aData.data.id;
		if(id) {
			aRequestItem.setValue("item", repository.getItem(id));
		}
		else {
			aRequestItem.setValue("item", null);
		}
		
		aRequestItem.status = 1;
	}

    _setupDataResponse(aRequestItem, aData) {
		this._updateObjects(aData.objects);
		
		let data = aData.data;
		if(data) {
			aRequestItem.setValue("data", data);
		}
		else {
			aRequestItem.setValue("data", null);
		}
		
		aRequestItem.status = 1;
	}

    requestUrl(aUrl) {
		
        let item = this._getRequestItem();
        
		let fullUrl = this._url + "url?url=" + encodeURIComponent(aUrl);
		fetch(fullUrl).then((aRequest) => {
			return aRequest.json();
		}).then((aData) => {
			this._setupItemResponseBound(item, aData);
		});
        
        return item;
    }

}