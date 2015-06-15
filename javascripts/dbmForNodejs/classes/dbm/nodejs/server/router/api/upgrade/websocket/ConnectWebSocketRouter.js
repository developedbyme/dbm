/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter", "dbm.nodejs.server.router.api.ApiCallRouter", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	//"use strict";
	
	var ConnectWebSocketRouter = dbm.importClass("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var WebSocketServerFunctions = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketServerFunctions");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var RoutedDataTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._performApiCall = function(aApiCallData) {
		console.log("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter::_performApiCall");
		
		var routingData = aApiCallData.routingData;
		var theRequest = routingData.request;
		
		var protocolVersion = WebSocketServerFunctions.connectUpgrade(theRequest, routingData.socket, routingData.headData, WebSocketServerFunctions.getOrigin(theRequest), WebSocketServerFunctions.getLocation(theRequest));
		
		//METODO: Add protocol version to data
		
		this.superCall(aApiCallData);
		
		//aRoutedData.setAsDone();
		//
		//if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
		//	this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, aRoutedData);
		//}
	};
	
	staticFunctions.create = function(aPath) {
		//console.log("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter::create");
		
		var newConnectWebSocketRouter = (new ClassReference()).init();
		
		ClassReference.setStaticPathQualifierToRouter(newConnectWebSocketRouter, aPath);
		
		return newConnectWebSocketRouter;
	};
});