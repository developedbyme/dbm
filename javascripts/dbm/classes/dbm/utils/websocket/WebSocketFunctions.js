/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.websocket.WebSocketFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.websocket.WebSocketFunctions");
	
	var WebSocketFunctions = dbm.importClass("dbm.utils.websocket.WebSocketFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
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