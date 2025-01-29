import Dbm from "../../index.js";

export default class WebSocketConnection extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

		this._url = null;
        this._webSocket = null;
		
		this._intervalId = -1;
        this._callback_onOpenBound = this._callback_onOpen.bind(this);
        this._callback_onMessageBound = this._callback_onMessage.bind(this);
		this._callback_onMessageBound = this._callback_onMessage.bind(this);
		this._callback_onCloseBound = this._callback_onClose.bind(this);
		this._callback_onErrorBound = this._callback_onError.bind(this);
		this._callback_sendHeartbeatBound = this._callback_sendHeartbeat.bind(this);

        this.item.setValue("requests", []);
        this.item.setValue("status", 0);
    }

    setup(aUrl) {
		this._url = aUrl;
		this._connect();
		
        return this;
    }
	
	_connect() {
		if(this.item.status === 0) {
	        this._webSocket = new WebSocket(this._url);
	        this.item.setValue("status", 2);

	        this._webSocket.onopen = this._callback_onOpenBound;
	        this._webSocket.onmessage = this._callback_onMessageBound;
			this._webSocket.onclose = this._callback_onCloseBound;
			this._webSocket.onerror = this._callback_onErrorBound;
		}
	}

    _getRequestItem() {
        let requestId = "graphApi/webSocketRequest" + Dbm.getInstance().getNextId();

        let request = new Dbm.graphapi.webclient.WebSocketRequest();
        request.item.register(requestId);
        request.item.setValue("status", Dbm.loading.LoadingStatus.NOT_STARTED);
        request.item.setValue("connection", this.item); 

        return request.item;
    }

    _runRequest(aRequestItem) {
        
        if(this.item.status === 1) {
            aRequestItem.setValue("status", Dbm.loading.LoadingStatus.LOADING);
            this._webSocket.send(JSON.stringify(aRequestItem.requestData));
        }
        else {
            let newRequests = [].concat(this.item.requests);
            newRequests.push(aRequestItem);
            this.item.setValue("requests", newRequests);
        }
    }

    requestRange(aSelect, aEncode) {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "range", "select": aSelect, "encode": aEncode, "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }

    requestItem(aId, aEncode) {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "item", "id": aId, "encode": aEncode, "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }

    requestData(aFunctionName, aData) {
        //console.log("requestData");
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "data", "functionName": aFunctionName, "data": aData, "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }

    createItem(aTypes, aVisibility = "draft", aChanges = [], aEncode = []) {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "admin/createObject", "types": aTypes, "visibility": aVisibility, "changes": aChanges, "encode": aEncode, "requestId": item.id});
        this._runRequest(item);

        return item;
    }

    editItem(aId, aChanges, aEncode = []) {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "admin/editObject", "id": aId, "changes": aChanges, "encode": aEncode, "requestId": item.id});
        this._runRequest(item);

        return item;
    }

    requestUrl(aUrl) {
		
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "url", "url": aUrl, "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }

    _callback_onOpen(aEvent) {
        console.log("_callback_onOpen");

		if(this._intervalId === -1) {
			this._intervalId = setInterval(this._callback_sendHeartbeatBound, 20*1000);
		}
    }
	
    _callback_onClose(aEvent) {
        console.log("_callback_onClose");
		console.log(aEvent);
		
		if(this._intervalId !== -1) {
			clearInterval(this._intervalId);
			this._intervalId = -1;
		}
		
		if(this._webSocket) {
			this._webSocket.onopen = null;
			this._webSocket.onmessage = null;
			this._webSocket.onclose = null;
			this._webSocket.onerror = null;
			
			this._webSocket = null;
		}
		
		this.item.setValue("status", 0);
		this._connect();;
    }
	
    _callback_onError(aEvent) {
        console.log("_callback_onError");
		console.log(aEvent);

        //MENOTE: do nothing
    }
	
	_callback_sendHeartbeat() {
		console.log("_callback_sendHeartbeat");
		
		this._webSocket.send(JSON.stringify({"type": "heartbeat"}));
	}

    _connectionReady() {
        this.item.setValue("status", 1);
        
        let currentArray = this.item.requests;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];
            currentItem.setValue("status", Dbm.loading.LoadingStatus.LOADING);
            this._webSocket.send(JSON.stringify(currentItem.requestData));
        }

        this.item.requests = [];
    }

    _callback_onMessage(aEvent) {
        //console.log("_callback_onMessage");
        //console.log(aEvent.data);

        let data = JSON.parse(aEvent.data);
        let repository = Dbm.getInstance().repository;
        switch(data.type) {
            case "updateEncodedObject":
                {
                    let item = repository.getItem(data["id"]);
                    let decoder = repository.getItemIfExists("graphApi/decode/" + data["encoding"]);
                    if(decoder) {
                        decoder.controller.updateItemWithEncoding(item, data["data"]);
                    }
                    else {
                        console.warn("No decoder for " + data["encoding"]);
                    }
                }
                break;
            case "range/response":
                {
                    let item = repository.getItem(data["requestId"]);
                    item.setValue("items", repository.getItems(data["ids"]));
                    item.setValue("status", Dbm.loading.LoadingStatus.LOADED);
                }
                break;
            case "item/response":
                {
                    let item = repository.getItem(data["requestId"]);
                    item.setValue("item", repository.getItem(data["id"]));
                    item.setValue("status", Dbm.loading.LoadingStatus.LOADED);

                    let currentArray = item.doneCommands;
                    if(currentArray) {
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            let currentCommand = currentArray[i];
                            currentCommand.perform(item, data["id"]);
                        }
                    }
                }
                break;
            case "data/response":
                {
                    let item = repository.getItem(data["requestId"]);
                    item.setValue("data", data["data"]);
                    item.setValue("status", Dbm.loading.LoadingStatus.LOADED);

                    let currentArray = item.doneCommands;
                    if(currentArray) {
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            let currentCommand = currentArray[i];
                            currentCommand.perform(item, data["data"]);
                        }
                    }
                }
                break;
            case "url/response":
                {
                    let item = repository.getItem(data["requestId"]);
                    if(data["id"]) {
                        item.setValue("item", repository.getItem(data["id"]));
                    }
                    else {
                        item.setValue("item", null);
                    }
                    item.setValue("status", Dbm.loading.LoadingStatus.LOADED);

                    let currentArray = item.doneCommands;
                    if(currentArray) {
                        let currentArrayLength = currentArray.length;
                        for(let i = 0; i < currentArrayLength; i++) {
                            let currentCommand = currentArray[i];
                            currentCommand.perform(item, data["id"]);
                        }
                    }
                }
                break;
            case "currentUser/response":
                {
                    let item = repository.getItem(data["requestId"]);
                    if(data["id"]) {
                        item.setValue("user", repository.getItem(data["id"]));
                    }
                    else {
                        item.setValue("user", null);
                    }
                    repository.getItem("site").currentUser = item.user;
                    item.setValue("status", Dbm.loading.LoadingStatus.LOADED);
                }
                break;
            case "connectionReady": 
                {
                    if(data["user"]) {
                        repository.getItem("site").currentUser = repository.getItem(data["user"]);
                    }
                    else {
                        repository.getItem("site").currentUser = null;
                    }
                    this._connectionReady();
                }
                break;
			case "heartbeat/response":
				//MENOTE: do nothing
				break;
            default:
                console.warn("Unknown message type " + data.type);
                break;
        }
    }

    signIn(aToken) {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "user/signInWithToken", "token": aToken, "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }

    signOut() {
        let item = this._getRequestItem();
        item.setValue("requestData", {"type": "user/signOut", "requestId": item.id});
        this._runRequest(item);
        
        return item;
    }
}