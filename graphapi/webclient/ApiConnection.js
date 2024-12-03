import Dbm from "../../index.js";

export default class ApiConnection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._url = null;
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
        
        
        return item;
    }

    requestItem(aId, aEncode) {
        let item = this._getRequestItem();
        
        
        return item;
    }

    requestData(aFunctionName, aData) {
        let item = this._getRequestItem();
        
        
        return item;
    }

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

    requestUrl(aUrl) {
		
        let item = this._getRequestItem();
        
		let fullUrl = this._url + "url?url=" + encodeURIComponent(aUrl);
		fetch(fullUrl).then((aRequest) => {
			return aRequest.json();
		}).then((aData) => {
			
			this._updateObjects(aData.objects);
			
			let repository = Dbm.getInstance().repository;
			item.setValue("item", repository.getItem(aData.data.id));
			item.status = 1;
		});
        
        return item;
    }

}