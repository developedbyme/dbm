dbm.registerClass("com.developedbyme.utils.websocket.WebSocketFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.websocket.WebSocketFunctions");
	
	var WebSocketFunctions = dbm.importClass("com.developedbyme.utils.websocket.WebSocketFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.supportsWebSocket = function() {
		return (window.WebSocket != undefined || window.MozWebSocket != undefined);
	};
	
	staticFunctions.createWebSocket = function(aUrl) {
		if(window.WebSocket != undefined) {
			return new WebSocket(aUrl);
		}
		else if(window.MozWebSocket != undefined) {
			return new MozWebSocket(aUrl);
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[WebSocketFunctions]", "createWebSocket", "Browser doesn't support web sockets.");
		
		return null;
	};
});