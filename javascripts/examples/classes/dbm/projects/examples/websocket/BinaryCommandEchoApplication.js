/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.websocket.BinaryCommandEchoApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var BinaryCommandEchoApplication = dbm.importClass("dbm.projects.examples.websocket.BinaryCommandEchoApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var WebSocketConnection = dbm.importClass("dbm.utils.websocket.WebSocketConnection");
	var BinaryCommandConnection = dbm.importClass("dbm.utils.websocket.binarycommand.BinaryCommandConnection");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var BinaryCommandDebugSetup = dbm.importClass("dbm.utils.websocket.binarycommand.setup.BinaryCommandDebugSetup");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var MessageExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MessageExtendedEventIds");
	var BinaryCommandPaths = dbm.importClass("dbm.constants.websocket.BinaryCommandPaths");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.websocket.BinaryCommandEchoApplication::_init");
		
		this.superCall();
		
		this._webSocket = null;
		this._encodingConnection = null;
		this._addStartFunction(this._connect, ["ws://localhost:8080/dbm/examples/command"]);
		
		return this;
	};
	
	objectFunctions._connect = function(aUrl) {
		console.log("dbm.projects.examples.websocket.BinaryCommandEchoApplication::_connect");
		
		this._webSocket = WebSocketConnection.create(aUrl);
		this._encodingConnection = BinaryCommandConnection.create(this._webSocket);
		BinaryCommandDebugSetup.setup(this._encodingConnection);
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, LogCommand.createCommand("Connection opened"));
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this._encodingConnection, this._encodingConnection.encodeAndSend, [BinaryCommandPaths.DEBUG_ECHO, "Hello echo!!!"]));
		
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CLOSE, LogCommand.createCommand("Connection closed", GetVariableObject.createSelectDataCommand()));
		this._webSocket.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ERROR, LogCommand.createCommand("Error", GetVariableObject.createSelectDataCommand()));
		
		this._webSocket.connect();
		console.log(this._webSocket);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});