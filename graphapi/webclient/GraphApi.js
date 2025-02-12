import Dbm from "../../index.js";

export default class GraphApi extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this._websocketConnection = null;
		this._apiConnection = null;
    }
	
	setWebsocketConnection(aConnection) {
		this._websocketConnection = aConnection;
		
		return this;
	}
	
	setApiConnection(aConnection) {
		this._apiConnection = aConnection;
		
		return this;
	}
	
    requestRange(aSelect, aEncode) {
        return this._websocketConnection.requestRange(aSelect, aEncode);
    }

    requestItem(aId, aEncode) {
        return this._websocketConnection.requestItem(aId, aEncode);
    }

    requestData(aFunctionName, aData) {
        return this._websocketConnection.requestData(aFunctionName, aData);
    }

    performAction(aFunctionName, aData) {
        return this._websocketConnection.performAction(aFunctionName, aData);
    }

    createItem(aTypes, aVisibility = "draft", aChanges = [], aEncode = []) {
        return this._websocketConnection.createItem(aTypes, aVisibility, aChanges, aEncode);
    }

    editItem(aId, aChanges, aEncode = []) {
        return this._websocketConnection.editItem(aId, aChanges, aEncode);
    }

	requestUrl(aUrl) {
		//console.log("requestUrl");
		//console.log(aUrl);
		
		if(this._websocketConnection && this._websocketConnection.item.status === 1) {
			return this._websocketConnection.requestUrl(aUrl);
		}
		
		return this._apiConnection.requestUrl(aUrl);
	}
	
    signIn(aToken) {
        return this._websocketConnection.signIn(aToken);
    }

    signOut() {
        return this._websocketConnection.signOut();
    }
}