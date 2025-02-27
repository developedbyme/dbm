import Dbm from "../../index.js";

export {default as WebSocketConnection} from "./WebSocketConnection.js";
export {default as WebSocketRequest} from "./WebSocketRequest.js";
export {default as GraphApi} from "./GraphApi.js";
export {default as ApiConnection} from "./ApiConnection.js";
export {default as ApiRequest} from "./ApiRequest.js";

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
}