import Dbm from "../../index.js";

export {default as WebSocketConnection} from "./WebSocketConnection.js";
export {default as WebSocketRequest} from "./WebSocketRequest.js";
export {default as GraphApi} from "./GraphApi.js";
export {default as ApiConnection} from "./ApiConnection.js";
export {default as ApiRequest} from "./ApiRequest.js";
export {default as CachedRequests} from "./CachedRequests.js";

export * as decode from "./decode/index.js";
export * as admin from "./admin/index.js";

export const setup = function(aWsPath, aApiPath) {
    let webSocketConnection = new Dbm.graphapi.webclient.WebSocketConnection();
    webSocketConnection.setup(aWsPath);
    
    let apiConnection = new Dbm.graphapi.webclient.ApiConnection();
    apiConnection.setup(aApiPath);
    
    let graphApi = new Dbm.graphapi.webclient.GraphApi();
    graphApi.setWebsocketConnection(webSocketConnection);
    graphApi.setApiConnection(apiConnection);
    graphApi.item.register("graphApi");

    let cachedRequests = new Dbm.graphapi.webclient.CachedRequests();
    cachedRequests.item.register("cachedGraphApi");
}

export const requireObjectEncoding = function(aObject, aEncoding, aCommand) {
    console.log("requireObjectEncoding");
    if(aObject["has/encoding/" + aEncoding]) {
        console.log(aObject, aEncoding);
        aCommand.perform(null, null);
    }
    else {
        let graphApi = Dbm.getRepositoryItem("cachedGraphApi").controller;
        
        let request = graphApi.requestItem(aObject.id, [aEncoding]);
        
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, aCommand);
    }
}

export const loadData = function(aType, aData, aCallback = null) {
    let request = Dbm.getGraphApi().requestData(aType, aData);

    if(aCallback) {
        let callbackCommand = Dbm.commands.callFunction(aCallback, [Dbm.core.source.staticObject(request, "data")]);
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, callbackCommand);
    }
    
    return request.properties.data;
}

export const performAction = function(aType, aData, aCallback = null) {
    let request = Dbm.getGraphApi().performAction(aType, aData);

    if(aCallback) {
        let callbackCommand = Dbm.commands.callFunction(aCallback, [Dbm.core.source.staticObject(request, "data")]);
        Dbm.flow.runWhenMatched(request.properties.status, Dbm.loading.LoadingStatus.LOADED, callbackCommand);
    }
    
    return request.properties.data;
}