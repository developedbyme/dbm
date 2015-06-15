/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var BinaryCommandEchoServerApplication = dbm.importClass("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ConnectWebSocketRouter = dbm.importClass("dbm.nodejs.server.router.api.upgrade.websocket.ConnectWebSocketRouter");
	var WebServer = dbm.importClass("dbm.nodejs.server.WebServer");
	var WebSocketServerConnection = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketServerConnection");
	var BinaryCommandConnection = dbm.importClass("dbm.utils.websocket.binarycommand.BinaryCommandConnection");
	var BufferEncodingData = dbm.importClass("dbm.nodejs.utils.websocket.binarycommand.BufferEncodingData");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var WebSocketEncodingFunctions = dbm.importClass("dbm.nodejs.utils.websocket.WebSocketEncodingFunctions");
	var BinaryCommandDebugSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MessageExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::_init");
		
		this.superCall();
		
		this._webServer = null;
		this._connections = new Array();
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::start");
		
		this._webServer = WebServer.create(8080);
		
		var apiPoint = ConnectWebSocketRouter.create("/dbm/examples/command");
		
		apiPoint.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._createConnection, [GetVariableObject.createSelectDataCommand()]));
		
		this._webServer.addUpgradeRouter(apiPoint);
		
		this._webServer.start();
	};
	
	objectFunctions._createConnection = function(aApiCallData) {
		//console.log("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::_createConnection");
		
		var nativeSocket = aApiCallData.routingData.socket;
		var socketConnection = WebSocketServerConnection.create(nativeSocket, 13); //MEDEBUG: use protocol version instead
		var newConnection = BinaryCommandConnection.create(socketConnection);
		newConnection.setEncodingDataClass(BufferEncodingData);
		BinaryCommandDebugSetup.setup(newConnection);
		
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.TIMEOUT, CallFunctionCommand.createCommand(socketConnection, socketConnection.close, []));
		socketConnection.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._connectionClosed, [newConnection]));
		this._connections.push(newConnection);
		newConnection.startUpdatingTransfer();
	};
	
	objectFunctions._connectionClosed = function(aConnection) {
		console.log("dbm.nodejs.projects.examples.websocket.BinaryCommandEchoServerApplication::_connectionClosed");
		
		var index = ArrayFunctions.indexOfInArray(this._connections, aConnection);
		if(index !== -1) {
			this._connections.splice(index, 1);
		}
		
		aConnection.destroy();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});